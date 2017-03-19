const express 			= require('express');
const router 			= express.Router();
//const passport 			= require('passport');
//const LocalStrategy 	= require('passport-local').Strategy;
const multer  			= require('multer');
const upload 			= multer({ dest: './uploads' });

const User 				= require('../models/User.js');

// router.use(passport.initialize());
// router.use(passport.session());

router.get('/register', (req, res, next) => {
  res.render('users/register', {
  	'title': 'Register'
  });
});

router.get('/login', (req, res, next) => {
  res.render('users/login', {
  	title: 'Log In',
  	message: req.flash('success')
  });
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

	// Check for Image Field
	const checkImageField = (req) => {
		if (req.file) {
			console.log('Uploading image...\n\n', req.file);
			req.file.filename = `${req.body.username}-${req.file.originalname}`;
			console.log('Changed name \n\n', req.file);
			// File info
			let image = {
				'profileImageOriginalName': req.file.filename
			};

			return image.profileImageName;
		} else {
			let image = {
				'profileImageName': 'noimage.png'
			};
			return image.profileImageName;
		}
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
			profileimage: checkImageField(req)
		});

		// Create User
		User.createUser(newUser, (err, user) => {
			if(err) throw err;
			console.log(user);
		});
	}

	// Success message
	req.flash('success', 'You are now registered and may log in');
  	res.redirect('/users/login');

});



// passport.serializeUser((user, done) => {
// 	done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
// 	User.getUserById(id, (err, user) => {
// 		done(err, user);
// 	});
// });

// passport.use(new LocalStrategy((username, password, done) => {
// 	User.getUserByUsername(username, (err, user) => {
// 		if(err) throw err;
// 		if(!user) {
// 			console.log('Unknown user');
// 			return done(null, false, {message: 'Unknown user'});
// 		}
// 	});

// 	User.comparePassword(password, user.password, (err, isMatch) => {
// 		if(err) throw err;
// 		if(isMatch) {
// 			return done(null, user);
// 		} else {
// 			console.log('Invalid password');
// 			return done(null, false, {message: 'Invalid password'});
// 		}
// 	});
// }));

// router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}), (req, res) => {
// 	console.log('Authentication successful');
// 	req.flash('sucess', 'You are logged in !');
// 	res.redirect('/');
// });

// router.post('/login', 
// 	passport.authenticate('local', { 
// 		successRedirect: '/', 
// 		failureRedirect: '/users/login', 
// 		failureFlash: true
// 	}), 
// 	(req, res) => {
// 		console.log(`Authentication successful #{req.user.username}`);
//     	res.redirect('/');
// 	}
// );

module.exports = router;
