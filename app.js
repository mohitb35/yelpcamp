const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const mongoose = require('mongoose');

mongoose.connect(
	'mongodb://localhost:27017/yelpcamp', //specifies URL, port and database name
	{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
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

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);



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