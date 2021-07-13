const express = require('express');
const router = express.Router();

const { campgroundSchema } = require('../schemas');
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

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

router.get('/new', (req, res) => {
	res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync( async (req, res) => {
	// if (!req.body.campground) throw new ExpressError (400, 'Invalid campground data');
	const camp = new Campground(req.body.campground);
	await camp.save();
	res.redirect(`/campgrounds/${camp.id}`);
}));

router.get('/:id', catchAsync( async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id).populate('reviews');
	console.log(campground);
	res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync( async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id);
	res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync( async (req, res) => {
	let campground = req.body.campground;
	let { id } = req.params;
	const updatedCamp = await Campground.findByIdAndUpdate(
			id, campground, { new: true, useFindAndModify: false, runValidators: true }
		);
	res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', catchAsync( async (req, res) => {
	let { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	res.redirect(`/campgrounds`);
}));

module.exports = router;