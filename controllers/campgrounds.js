const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const {  cloudinary } = require('../cloudinary');

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
	const geoData = await geocoder.forwardGeocode({
		query: camp.location,
		limit: 1
	}).send();
	camp.geometry = geoData.body.features[0].geometry;
	camp.images = req.files.map( image => {
		return {
			url: image.path,
			filename: image.filename,
			originalname: image.originalname
		}
	});
	camp.author = req.user.id;
	console.log(camp);
	await camp.save();
	console.log(camp);
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
	console.log(campground.images[0].thumbnailUrl);
	res.render('campgrounds/edit', { campground });
};

const updateCampground = async (req, res) => {
	let campground = req.body.campground;
	let { id } = req.params;
	let images = req.files.map( image => {
		return {
			url: image.path,
			filename: image.filename,
			originalname: image.originalname
		}
	});
	let imagesToDelete =  req.body.deleteImages;

	const updatedCamp = await Campground.findByIdAndUpdate(
			id, campground, { new: true, useFindAndModify: false, runValidators: true }
		);
	if (imagesToDelete) {
		for (let image of imagesToDelete){
			await cloudinary.uploader.destroy(image, { invalidate : true });
		}
		await updatedCamp.updateOne(
			{ $pull : 
				{ images: 
					{ filename: { $in: imagesToDelete } }
				} 
			}
		);
	}
	updatedCamp.images.push(...images);
	updatedCamp.save();
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