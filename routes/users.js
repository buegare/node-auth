const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: './uploads' });

const User = require('../models/User.js');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register', {
  	'title': 'Register'
  });
});

router.get('/login', (req, res, next) => {
  res.render('login', {
  	'title': 'Log In'
  });
});

router.post('/register', upload.single('profileimage'), (req, res, next) => {
	
	// Get form values
	let name = req.body.name;
	let email = req.body.email;
	let username = req.body.username;
	let password = req.body.password;
	let password2 = req.body.password2;

	// Check for Image Field
	const checkImageField = (file) => {
		if (file) {
			console.log('Uploading image...');

			// File info
			let image = {
				'profileImageOriginalName': req.file.profileimage.originalname,
				'profileImageName': 		req.file.profileimage.name,
				'profileImageMime': 		req.file.profileimage.mimetype,
				'profileImagePath': 		req.file.profileimage.path,
				'profileImageExt': 			req.file.profileimage.extension,
				'profileImageSize': 		req.file.profileimage.size
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
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check for errors
	let errors = req.validationErrors();

	if(errors) {
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		let newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: checkImageField(req.file)
		});


		// Create User
		User.createUser(newUser, (err, user) => {
			if(err) throw err;
			console.log(user);
		});
	}

	

	// Success message
	// req.flash('success', 'You are now registered and may log in');

	// Redirect to home page
	res.location('/');
	res.redirect('/');

});


module.exports = router;
