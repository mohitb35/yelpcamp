const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

const isLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in first!');
		return res.redirect('/login');
	}
	next();
}

const isAuthor = async (req, res, next) => {
	let { id } = req.params;
	const foundCampground = await Campground.findById(id);
	if (!foundCampground) {
		req.flash('error', 'Camp not found');
		return res.redirect('/campgrounds');
	}
	if (!foundCampground.author.equals(req.user.id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	
	if (error) {
		const msg = error.details.map((el => el.message)).join(',');
		throw new ExpressError(400, msg);
	}

	next();
}

const isReviewAuthor = async (req, res, next) => {
	let { id, reviewId } = req.params;
	const foundReview = await Review.findById(reviewId);
	if (!foundReview) {
		req.flash('error', 'Review not found');
		return res.redirect(`/campgrounds/${id}`);
	}
	if (!foundReview.author.equals(req.user.id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	
	if (error) {
		const msg = error.details.map((el => el.message)).join(',');
		throw new ExpressError(400, msg);
	}

	next();
}

module.exports = {
	isLoggedIn,
	isAuthor,
	validateCampground,
	isReviewAuthor,
	validateReview
}