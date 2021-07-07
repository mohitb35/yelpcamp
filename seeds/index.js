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
			location: `${city}, ${state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: 'https://source.unsplash.com/collection/483251/800x600',
			description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam tempora laboriosam ea corrupti officiis odio eaque assumenda iste provident, sapiente accusantium fuga perferendis recusandae laborum.',
			price
		});
		await camp.save();
	}
}


seedDB().then(() => {
	mongoose.connection.close();
});