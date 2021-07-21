const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users');

// const catchAsync = require('../utils/catchAsync');

// User Routes
router.get('/register', usersController.renderRegisterForm);

router.post('/register', usersController.createUser);

router.get('/login', usersController.renderLoginForm);


router.post('/login',
	passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
	usersController.login
);

router.get('/logout', usersController.logout)

module.exports = router;