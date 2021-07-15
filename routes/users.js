const express = require('express');
const router = express.Router();
const User = require('../models/user');

// const catchAsync = require('../utils/catchAsync');

// User Routes
router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', async (req, res) => {
	// Note - not wrapping the function in catchAsync, as we do not want the default Error handler to handle an error here and show the error template. Instead we want to stay on this page. So we use a try catch block within this function itself.
	try {
		const { username, email, password } = req.body.user;
		const user = new User({ username, email });
	
		const savedUser = await User.register(user, password);
		req.flash('success', 'Welcome to Yelpcamp');
		res.redirect('/campgrounds');
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('/register');
	}
});

module.exports = router;