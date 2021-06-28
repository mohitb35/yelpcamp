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
		let camp = new Campground({
			location: `${city}, ${state}`,
			name: `${sample(descriptors)} ${sample(places)}`
		});
		await camp.save();
	}
}

seedDB().then(() => {
	mongoose.connection.close();
});