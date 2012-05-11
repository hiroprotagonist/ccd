
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , models = require('./models')
  , everyauth = require('everyauth')
  , nconf = require('nconf')
  , RedisStore = require('connect-redis')(express)
  , Document
  , db;

everyauth.everymodule.findUserById( function (userId, callback) {
	User.findById(userId, callback);
  	// callback has the signature, function (err, user) {...}
});

// Setup Auth
everyauth.password
	.getLoginPath('/login')
	.postLoginPath('/login')
	.loginView('login')
	.authenticate(function(login, password) {
		var errors = new Array;
		if (!login) errors.push('Missing login');
      	if (!password) errors.push('Missing password');
      	if (errors.length) return errors;
      	
      	var promise = this.Promise();
		User.findOne({'login': login}, function(err, user) {
			// For better readabiliy... BUT Very shitty 
			// if the following returns get lost
			if ( err || !user ) return promise.fulfill( ['User not found'] );
			if ( ! user.authenticate(password) ) return promise.fulfill( ['Invalid password'] );
			
			console.dir(user);
			promise.fulfill( user );
		});
		return promise;
	})
	.loginSuccessRedirect('/you')
	.getRegisterPath('/register')
	.postRegisterPath('/register')
	.registerView('register.jade')
	.validateRegistration( function(newUserAttr) {
		console.log('validate');
		console.dir(newUserAttr);
		var err = new Array;
		if ( !newUserAttr.login || newUserAttr.login.trim().length < 3 ) {
			err.push('Login must be 3 characters long at least');
		}
		if ( !newUserAttr.password || newUserAttr.password.trim().length < 3 ) {
			err.push('Password must be 3 characters long at least');
		}
		return err;
	} )
	.registerUser(function(newUserAttr) {
		var user = new User(newUserAttr);
		var promise = this.Promise();
		user.save(function(err) {
			if ( err ) {
				console.log( 'Fail ' + err );
				promise.fulfill([err]);
			} else {
				console.log( 'Butterweich' );
				promise.fulfill(user);
			}
		});
		return promise;
	})
	.registerSuccessRedirect('/you');

var app = module.exports = express.createServer(  );
everyauth.helpExpress(app);

/* Load config.jso */
nconf.use('file', {file: './config.json'})
nconf.load();

// Configuration
// This is like an Interceptor Stack in Struts2
// Node People call it middleware
// The middlewares/Interceptors will run as orderd
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', {layout: true});
	
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "0sk38dfn2390", 
		store: new RedisStore({ 
			host: nconf.get('redis').host,
			port: nconf.get('redis').port
		}) 
	}));
	
	app.use(everyauth.middleware());

	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));

	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	app.set('db-uri', nconf.get('mongo').uri);
	app.set('view options', {
		pretty: true
	});
	everyauth.debug = false;
});

// app.configure('development', function() { });
// app.configure('production', function(){ app.use(express.errorHandler()); });

models.defineModels(mongoose, function() {
	app.Document = Document = mongoose.model('Document');
	app.User = User = mongoose.model('User');
	db = mongoose.connect(app.set('db-uri'));
})


// Routes
// Everybody can GET everybodies data 
function loadUser(req, res, next) {
	if ( req.session.auth && req.session.auth.loggedIn ) {
		next();
	} else {
		res.redirect('/login');
	}
}
// But Updates are firewalled
function updateGranted(req, res, next) {
	if ( req.params.id === req.user.id ) next();
	else res.json( {}, 403 );
}
var fireWall = [loadUser, updateGranted];

// UI routes
app.get('/', routes.index);
app.get('/you', loadUser, routes.you);
app.get('/all', loadUser, routes.all);
// app.get('/documents', loadUser, routes.index);

// Service routes
app.get('/users', loadUser, function(req, res) {
	User.find(function(error, users) {
	  	if( error ) res.json({msg: "Failed listing users"}, 500);
		else res.json(users, 200);
	});
});
app.get('/users/:id', loadUser, function(req, res) {
	res.json( req.user, 200 );
});

app.put('/users/:id', fireWall, function(req, res) {
	// This is bad shit
	// And its even shittier to place it in the model
	var phaseCycle = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'white'];
	if (req.body.phase === 'black') {
		req.body.day = 1;
		req.body.phase = 'red';	
	} else if(req.body.day > 21) {
		req.body.day = 1;
		var idx = phaseCycle.indexOf(req.body.phase);
		req.body.phase = (idx == phaseCycle.indexOf('white')) ? 'red' : phaseCycle[idx +1];
	}
	
	var upd_cb = function(err, numAffected) {
		if ( err || numAffected === 0 ) res.json( err, 500);
		else {
			User.findOne( {_id: req.user.id}, function( err, user ) {
				if ( err || !user ) res.json({}, 404);
				else res.json( user, 200 );
			} );
		}
	}
	User.update({_id: req.user.id}, {day: req.body.day, phase: req.body.phase}, {multi: false}, upd_cb);
});

app.del('/users/:id', fireWall, function(req, res) {
	users.remove(req.params.id, function(error, deleted) {
	  	if ( error ) res.json({msg: "User not found"}, 404); 
		else res.json({msg: "Bye Bye! You're out."}, 200);
	});
});
if ( !module.parent ) {
	var port = process.env.PORT || 3000;
	app.listen(port, function() {
		console.log("Listening on " + port);
	});
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}
