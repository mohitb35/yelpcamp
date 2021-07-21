const User = require('../models/user');

const renderRegisterForm = (req, res) => {
	res.render('users/register');
};

const createUser = async (req, res) => {
	// Note - not wrapping the function in catchAsync, as we do not want the default Error handler to handle an error here and show the error template. Instead we want to stay on this page. So we use a try catch block within this function itself.
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email });
	
		const savedUser = await User.register(user, password);
		req.login(savedUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to Yelpcamp!');
			res.redirect('/campgrounds');
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('/register');
	}
}

const renderLoginForm = (req, res) => {
	res.render('users/login');
}

const login = async (req, res) => {
	req.flash('success', 'Welcome back!');
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
}

const logout = (req, res) => {
	req.logout();
	req.flash('success', 'Logged out successfully');
	res.redirect('/campgrounds');
}

module.exports = {
	renderRegisterForm,
	createUser,
	renderLoginForm,
	login,
	logout
}