const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const campgroundSchema = new Schema({
	title: {
		type: String
	},
	images: [
		{
			url: String,
			filename: String,
			originalname: String
		}
	],
	price: {
		type: Number
	},
	description: {
		type: String
	},
	location: {
		type: String
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

/* campgroundSchema.pre('findOneAndDelete', (next) => {
	console.log("Pre");
	console.log(this);
	next();
})
 */
campgroundSchema.post('findOneAndDelete', async (doc) => {
	/* console.log("Post");
	console.log(doc); */
	if (doc) {
		await Review.remove({
			_id: {$in: doc.reviews}
		})
	};
})

module.exports = mongoose.model('Campground', campgroundSchema);