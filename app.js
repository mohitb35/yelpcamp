const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const mongoose = require('mongoose');

mongoose.connect(
	'mongodb://localhost:27017/yelpcamp', //specifies URL, port and database name
	{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
)
.then(() => {
	console.log("Connected to yelpcamp DB");
})
.catch(error => {
	console.log("Error connecting to yelpcamp DB");
	console.log(`${error.name} - ${error.message}`);
})

// Listening for error events on the connection
mongoose.connection.on('error', err => {
	console.log(err);
  });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
	secret: 'thishastobechangedlater',
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
		maxAge: (1000 * 60 * 60 * 24 * 7),
		httpOnly: true
	}
};
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
//For persistent login sessions. Must be after session in the middleware sequence
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); 
//stores userId in session
passport.deserializeUser(User.deserializeUser()); 
//gets user info based on userId stored in session

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// Dummy function to demonstrate user reg with passport. To be deleted later.
app.get('/fakeUser', async (req, res) => {
	const user = new User({
		email: 'abc@somemail.com',
		username: 'abcd'
	});

	const newUser = await User.register(user, 'password');
	res.send(newUser);
})

// Routes
app.get('/', (req, res) => {
	res.render('home');
})

// Catch All Route
app.all('*', (req, res, next) => {
	next(new ExpressError(404, 'Page not found!'));
})

// Error handling middleware
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
 	// res.send("Something went wrong!!");
	res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("Server started at port", port);
})