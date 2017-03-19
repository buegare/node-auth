const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');

const db = mongoose.connection;

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

module.exports.comparePassword = function(username, callback) {
	console.log('comparePassword ****************');
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) return callback(err);
		callback(null, isMatch);
	});
};

module.exports.getUserByUsername = function(username, callback) {
	console.log('getUserByUsername ****************');
	let query = {username: username};
	User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
	console.log('getUserById ****************');
	User.findById(id, callback);
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