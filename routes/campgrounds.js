const express = require('express');
const router = express.Router();

const campgroundsController = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// Campground Routes
// Groups the '/' routes
router.route('/')
	.get(catchAsync(campgroundsController.index))
	.post(isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground));

// router.get('/', catchAsync(campgroundsController.index));

router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground));

// Groups '/:id' routes together
router.route('/:id')
	.get(catchAsync(campgroundsController.showCampground))
	.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

// router.get('/:id', catchAsync(campgroundsController.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm));

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground));
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));

module.exports = router;