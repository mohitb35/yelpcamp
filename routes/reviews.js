const express = require('express');
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require('../schemas');
const Review = require('../models/review');
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	
	if (error) {
		const msg = error.details.map((el => el.message)).join(',');
		throw new ExpressError(400, msg);
	}

	next();
}

// Review Routes
router.post('/', validateReview, catchAsync( async (req, res) => {
	const { id } = req.params;
	const review = new Review(req.body.review);
	const campground = await Campground.findById(id);
	campground.reviews.push(review);
	await review.save(); //Need to save the new review into DB, otherwise we will only have an empty object reference
	await campground.save();
	req.flash('success', 'Successfully added review..');
	// console.log(campground);
	res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete('/:reviewId', catchAsync( async (req, res) => {
	let { id, reviewId } = req.params;
	const camp = await Campground.findByIdAndUpdate(
		id, 
		{$pull: {reviews: reviewId}}, 
		{new: true} //Option to return updated camp info after update
	);
	console.log("Updated camp:",camp);
	const deletedReview = await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted review..');
	res.redirect(`/campgrounds/${camp.id}`);
}));

module.exports = router;