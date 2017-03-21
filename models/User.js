const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// User Schema

let UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {	
		type: String, 
		require: true, 
		bcrypt: true
	},
	email: { type: String },
	name: {	type: String },
	profileimage: {	type: String }
});

const User = module.export = db.model('User', UserSchema);
module.exports = User;

module.exports.authenticate = function(username, password, cb) {
	// Search for user in the database
	this.findOne({username: username}, 'username password', (err, user) => {
		if(err) {
			console.err(err);
			return cb(null, false, {message: 'A unknown error occured'});
		}
		// Return message if the user isn't found
		if(!user) return cb(null, false, {message: 'Username unknown'});

		// Check if credentials matches with the hashed password in the db
		bcrypt.compare(password, user.password, (err, isMatch) => {
			if(err) return cb(err);
			return isMatch ?
			cb(null, user) :
			cb(null, false, {message: 'Invalid credentials for the user'});		
			
		});
	});

};

module.exports.getUserById = function(id, callback) { 
	this.findById(id, callback); 
};

module.export.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, (err, hash) => {
		if(err) throw err;
		// Set hashed pwd
		newUser.password = hash;
		// Save user in the database;
		newUser.save(callback);
	});
};