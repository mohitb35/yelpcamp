const Review = require('../models/review');
const Campground = require('../models/campground');

const createReview = async (req, res) => {
	const { id } = req.params;
	const review = new Review(req.body.review);
	review.author = req.user.id;
	const campground = await Campground.findById(id);
	campground.reviews.push(review);
	await review.save(); //Need to save the new review into DB, otherwise we will only have an empty object reference
	await campground.save();
	req.flash('success', 'Successfully added review..');
	// console.log(campground);
	res.redirect(`/campgrounds/${campground.id}`);
}

const deleteReview = async (req, res) => {
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
}

module.exports = {
	createReview,
	deleteReview
};