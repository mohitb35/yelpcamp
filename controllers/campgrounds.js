const Campground = require('../models/campground');

const index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/', { campgrounds });
}

const renderNewForm = (req, res) => {
	/* if(!req.isAuthenticated()){
		req.flash('error', 'You must be logged in to create a campground');
		return res.redirect('/login');
	} */ //Replaced by isLoggedIn middleware
	res.render('campgrounds/new');
};

const createCampground = async (req, res) => {
	// if (!req.body.campground) throw new ExpressError (400, 'Invalid campground data');
	const camp = new Campground(req.body.campground);
	camp.author = req.user.id;
	await camp.save();
	req.flash('success', 'New campground created..');
	res.redirect(`/campgrounds/${camp.id}`);
}

const showCampground = async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id).populate({
		path: 'reviews',
		populate: {
			path: 'author'
		}
	}).populate('author');
	if (!campground) {
		req.flash('error', 'Camp not found');
		res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
}

const renderEditForm = async (req, res) => {
	let { id } = req.params;
	const campground = await Campground.findById(id);
	res.render('campgrounds/edit', { campground });
};

const updateCampground = async (req, res) => {
	let campground = req.body.campground;
	let { id } = req.params;
	
	const updatedCamp = await Campground.findByIdAndUpdate(
			id, campground, { new: true, useFindAndModify: false, runValidators: true }
		);
	req.flash('success', 'Successfully updated campground..');
	res.redirect(`/campgrounds/${updatedCamp.id}`);
}

const deleteCampground = async (req, res) => {
	let { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted campground..');
	res.redirect(`/campgrounds`);
}

module.exports = {
	index,
	renderNewForm,
	createCampground,
	showCampground,
	renderEditForm,
	updateCampground,
	deleteCampground
};