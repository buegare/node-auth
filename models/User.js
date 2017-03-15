const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');

const db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
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

module.export.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, (err, hash) => {
		if(err) throw err;
		// Set hashed pwd
		newUser.password = hash;
		// Save user in the database;
		newUser.save(callback);
	});
};