const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

const db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {	type: String },
	email: { type: String },
	name: {	type: String },
	profileimage: {	type: String }
});


const User = module.export = db.model('User', UserSchema);
module.exports = User;

module.export.createUser = function(newUser, callback) {
	newUser.save(callback);
};