const Joi = require('joi');

const campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		location: Joi.string().required(),
		price: Joi.number().min(0).precision(2).required(),
		image: Joi.string().uri().required(),
		description: Joi.string().required()
	}).required()
});

const reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().integer().min(1).max(5).required()
	}).required()
})

module.exports = {
	campgroundSchema, reviewSchema
};