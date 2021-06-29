const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');

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

// Routes
app.get('/', (req, res) => {
	res.render('home');
})

app.get('/campgrounds', async (req, res) => {
	let campgrounds;
	try {
		campgrounds = await Campground.find({});
	} catch (error) {
		console.log("Error retrieving campgrounds");
		console.log(error.message);
	}
	res.render('campgrounds/', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
	let camp = new Campground(req.body.campground);
	try {
		await camp.save();
	} catch (error) {
		console.log("Error creating campground");
		console.log(error.message);
	}
	res.redirect(`/campgrounds/${camp.id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
	let campground;
	let { id } = req.params;
	try {
		campground = await Campground.findById(id);
	} catch (error) {
		console.log("Error retrieving campgrounds");
		console.log(error.message);
	}
	res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
	let campground;
	let { id } = req.params;
	try {
		campground = await Campground.findById(id);
	} catch (error) {
		console.log("Error retrieving campground");
		console.log(error.message);
	}
	res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
	let campground = req.body.campground;
	let { id } = req.params;
	let updatedCamp;

	try {
		updatedCamp = await Campground.findByIdAndUpdate(
			id, 
			campground, 
			{ new: true, useFindAndModify: false, runValidators: true }
		);
	} catch (error) {
		console.log("Error updating campground");
		console.log(error.message);
	}

	res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
	let { id } = req.params;
	let deletedCamp;

	try {
		deletedCamp = await Campground.findByIdAndDelete(id);
	} catch (error) {
		console.log("Error deleting campground");
		console.log(error.message);
	}

	res.redirect(`/campgrounds`);
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("Server started at port", port);
})