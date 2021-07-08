const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
	title: {
		type: String
	},
	image: {
		type: String
	},
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
	]
});

/* CampgroundSchema.pre('findOneAndDelete', (next) => {
	console.log("Pre");
	console.log(this);
	next();
})
 */
CampgroundSchema.post('findOneAndDelete', async (doc) => {
	/* console.log("Post");
	console.log(doc); */
	if (doc) {
		await Review.remove({
			_id: {$in: doc.reviews}
		})
	};
})

module.exports = mongoose.model('Campground', CampgroundSchema);