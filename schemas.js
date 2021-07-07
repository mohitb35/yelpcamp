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

module.exports = {
	campgroundSchema
};