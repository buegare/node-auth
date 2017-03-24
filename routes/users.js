const express 			= require('express');
const router 			= express.Router();
const passport 			= require('passport');
const LocalStrategy 	= require('passport-local').Strategy;
const User 				= require('../models/User.js');
const multer  			= require('multer');
const config            = require('../config/server');
const path              = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(config.user_profile_image_destination_path));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.username}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.get('/register', (req, res, next) => {
  res.render('users/register', { title: 'Register' });
});

router.get('/login', (req, res, next) => {
  res.render('users/login', { title: 'Log In' });
});

router.post('/register', upload.single('profileimage'), (req, res, next) => {
	
	// Create a new user object with the information from the form
	let user = {
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		password2: req.body.password2
	};

	// Form validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(user.password);

	// Check for errors
	let errors = req.validationErrors();

	if(errors) {
		res.render('users/register', {
			errors: errors,
			name: user.name,
			email: user.email,
			username: user.username,
			password: user.password,
			password2: user.password2
		});
	} else {
		let newUser = new User({
			name: user.name,
			email: user.email,
			username: user.username,
			password: user.password,
			profileimage: req.file ? req.file.filename : 'noimage.png'
		});

		// Create User
		User.createUser(newUser, (err, user) => {
			if(err) throw err;
			console.log(user);
		});
	}

	// Success message
	req.flash('success_msg', 'You are now registered and may log in');
  	res.redirect('/users/login');

});

passport.use(new LocalStrategy((username, password, done) => User.authenticate(username, password, done) ));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
	User.getUserById(id, (err, user) => {
		if (err) { return done(err); }
		done(null, user);
	});
});

router.post('/login', 
	passport.authenticate('local', { failureRedirect: '/users/login', 
									 failureFlash: true	}),
	(req, res) => {
		req.flash('success_msg', 'Log in successfully');
		res.redirect('/');
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are now logged out');
	res.redirect('/users/login');
});

module.exports = router;
