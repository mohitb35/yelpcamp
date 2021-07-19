const express = require('express');
const router = express.Router();

const { campgroundSchema } = require('../schemas');
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	
	if (error) {
		const msg = error.details.map((el => el.message)).join(',');
		throw new ExpressError(400, msg);
	}

	next();
}

// Campground Routes
router.get('/', catchAsync( async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
	/* if(!req.isAuthenticated()){
		req.flash('error', 'You must be logged in to create a campground');
		return res.redirect('/login');
	} */ //Replaced by isLoggedIn middleware
	res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync( async (req, res) => {
	// if (!req.body.campground) throw new ExpressError (400, 'Invalid campground data');
	const camp = new Campground(req.body.campground);
	camp.author = req.user.id;
	await camp.save();
	req.flash('success', 'New campground created..');
	res.redirect(`/campgrounds/${camp.id}`);
}));

router.get('/:id', catchAsync( async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id).populate('reviews').populate('author');
	console.log(campground);
	if (!campground) {
		req.flash('error', 'Camp not found');
		res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync( async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', 'Camp not found');
		res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync( async (req, res) => {
	let campground = req.body.campground;
	let { id } = req.params;
	const updatedCamp = await Campground.findByIdAndUpdate(
			id, campground, { new: true, useFindAndModify: false, runValidators: true }
		);
	req.flash('success', 'Successfully updated campground..');
	res.redirect(`/campgrounds/${updatedCamp.id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync( async (req, res) => {
	let { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted campground..');
	res.redirect(`/campgrounds`);
}));

module.exports = router;