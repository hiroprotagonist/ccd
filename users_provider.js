// Setup MongoDB
var Db = require('mongojs')
  , DbURL = 'teamccd';

Users = function() {
	this.collections = ['users'];
	this.db = Db.connect(DbURL, this.collections);
	this.err = 1;
	};

Users.prototype.list = function(callback) {
	this.db.users.find(function(err, users) {
		if ( err || !users) callback(this.err);
		else callback(null, users);
		});
	};

Users.prototype.findUser = function(id, callback) {
	this.db.users.findOne({_id: this.db.ObjectId( id )}, function(err, user) {
		if( err || !user ) callback(this.err);
		else callback(null, user);
	});
};

Users.prototype.add = function(user, callback) {
	this.db.users.save(user, function(err, saved) {
		if( err || !saved ) callback(this.err);
		else callback(null, saved);
	});
};
Users.prototype.remove = function(id, callback) {
	this.db.users.remove({_id: this.db.ObjectId( id )}, function(err, deleted) {
		if( err || !deleted ) callback(this.err);
		else callback(null, deleted);
	});
};
Users.prototype.update = function(id, data, callback) {
	var users = this;
	this.db.users.update({_id: this.db.ObjectId( id )}, data, {multi: false}, function(err) {
			if( err ) callback(this.err);
			else users.findUser(id, callback);
		});
};
