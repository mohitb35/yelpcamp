const express = require('express');
const router = express.Router();
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

const campgroundsController = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// Campground Routes
// Groups the '/' routes
router.route('/')
	.get(catchAsync(campgroundsController.index))
	.post(isLoggedIn, upload.array('campground[images]'), validateCampground, catchAsync(campgroundsController.createCampground));
	/* .post(upload.single('campground[image]'), (req,res) => {
		console.log(req.file);
		res.send(req.body);
	}) */
/* 	.post(upload.array('campground[image]'), (req,res) => {
		console.log(req.files);
		res.send(req.body);
	}) */

// router.get('/', catchAsync(campgroundsController.index));

router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground));

// Groups '/:id' routes together
router.route('/:id')
	.get(catchAsync(campgroundsController.showCampground))
	.put(isLoggedIn, isAuthor, upload.array('campground[images]'), validateCampground, catchAsync(campgroundsController.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

// router.get('/:id', catchAsync(campgroundsController.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm));

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground));
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));

module.exports = router;