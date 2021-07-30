const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
	url: String,
	filename: String,
	originalname: String
})

imageSchema.virtual('thumbnailUrl').get(function() {
	/* let { url } = this;
	let breakpoint = url.indexOf('upload/') + 7;
	let part1 = url.slice(0, breakpoint);
	let modifier = 'w_200';
	let part2 = url.slice(breakpoint-1);
	return part1 + modifier + part2; */
	return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
	{
		title: {
			type: String
		},
		images: [imageSchema],
		price: {
			type: Number
		},
		description: {
			type: String
		},
		geometry: {
			type: {
				type: String,
				enum: ['Point'], 
				required: true
			},
			coordinates: {
				type: [Number],
				required: true
			}
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
	},
	opts
);

campgroundSchema.virtual('properties.popupMarkup').get(function() {
	return `
		<h5><a href="/campgrounds/${this.id}" target="_blank">${this.title}</a></h5>
		<p>${this.location}</p>
	`
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