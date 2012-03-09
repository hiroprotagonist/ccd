
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
	// ???	
	require('./users_provider').Users;
var users = new Users();
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/', routes.index);
app.get('/users', function(req, res) {
	users.list(function(error, users) {
	  	if( error ) res.json({msg: "Failed listing users"}, 500);
		else res.json(users, 200);
	});
});
app.get('/users/:id', function(req, res) {
	users.findUser(req.params.id, function(error, user) {
	  	if( error ) res.json({msg: "User not found"}, 404); 
		else res.json(user, 200);
	});
});

// POST / Add new user 
app.post('/users', function(req, res) {
	users.add(req.body, function(error, saved) {
	  	if( error ) res.json({msg: "Cannot add user"}, 500);
		else res.json(saved, 201);
	});
});

app.put('/users/:id', function(req, res) {
		var phaseCycle = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'white'];
		if (req.body.phase === 'black') {
			req.body.day = 1;
			req.body.phase = 'red';	
		} else if(req.body.day > 21) {
			req.body.day = 1;
			var idx = phaseCycle.indexOf(req.body.phase);
			req.body.phase = (idx == phaseCycle.indexOf('white')) ? 'red' : phaseCycle[idx +1];
		}
		users.update(req.params.id, req.body, function(err, user) {
			if( err ) res.json({msg: 'Failed updating user'}, 400);
			else res.json(user, 200);
			});
		});
app.del('/users/:id', function(req, res) {
	users.remove(req.params.id, function(error, deleted) {
	  	if( error ) res.json({msg: "User not found"}, 404); 
		else res.json({msg: "Bye Bye! You're out."}, 200);
	});
});
app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
