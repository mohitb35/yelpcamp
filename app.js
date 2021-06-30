const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const { campgroundSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const Campground = require('./models/campground');

const mongoose = require('mongoose');
const campground = require('./models/campground');

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

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	
	if (error) {
		const msg = error.details.map((el => el.message)).join(',');
		throw new ExpressError(400, msg);
	}

	next();
}

// Routes
app.get('/', (req, res) => {
	res.render('home');
})

app.get('/campgrounds', catchAsync( async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync( async (req, res) => {
	// if (!req.body.campground) throw new ExpressError (400, 'Invalid campground data');
	const camp = new Campground(req.body.campground);
	await camp.save();
	res.redirect(`/campgrounds/${camp.id}`);
}));

app.get('/campgrounds/:id', catchAsync( async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id);
	res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync( async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id);
	res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync( async (req, res) => {
	let campground = req.body.campground;
	let { id } = req.params;
	const updatedCamp = await Campground.findByIdAndUpdate(
			id, campground, { new: true, useFindAndModify: false, runValidators: true }
		);
	res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id', catchAsync( async (req, res) => {
	let { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	res.redirect(`/campgrounds`);
}));

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