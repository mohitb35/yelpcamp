const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect(
	'mongodb://localhost:27017/yelpcamp', //specifies URL, port and database name
	{ useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
	console.log("Connected to yelpcamp DB");
})
.catch(error => {
	console.log("Error connecting to yelpcamp DB");
	console.log(`${error.name} - ${error.message}`);
})

// Listening for error events on the connection
mongoose.connection.on('error', err => {
	console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 200; i++) {
		let { city, state } = sample(cities);
		const price = Math.floor(Math.random() * 20) + 10;
		let camp = new Campground({
			images: [ 
				{ 
					url:'https://res.cloudinary.com/dhf2swifx/image/upload/v1627280876/YelpCamp/d9xkqcz0mnn2jqrslqdf.jpg',
					filename: 'YelpCamp/d9xkqcz0mnn2jqrslqdf',
					originalname: 'photo-1476041800959-2f6bb412c8ce.jpeg' 
				},
				{
					url: 'https://res.cloudinary.com/dhf2swifx/image/upload/v1627280875/YelpCamp/zrban2ytmuepozjmnibm.jpg',
					filename: 'YelpCamp/zrban2ytmuepozjmnibm',
					originalname: 'camgground image.jpeg' 
				}
			],
			geometry: { 
				type: 'Point', 
				coordinates: [ -97.9222112121185, 39.3812661305678 ] 
			},
			author: '60efd4b5c209d65646744745',
			location: `${city}, ${state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam tempora laboriosam ea corrupti officiis odio eaque assumenda iste provident, sapiente accusantium fuga perferendis recusandae laborum.',
			price
		});
		await camp.save();
	}
}


seedDB().then(() => {
	mongoose.connection.close();
});