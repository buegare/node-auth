const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/User.js');
const config    = require('../config/server');
const path      = require('path');

const ensureAuthenticated = (req, res, next) => {
	// req.isAuthenticated() is a Passport.js function
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
};

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', { 
  	title: 'Dashboard',
  	profileimage_path: path.join(config.user_profile_image_path)
  });
});

module.exports = router;
