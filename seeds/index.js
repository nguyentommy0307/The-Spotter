const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const spotter = require('../models/spotter')


mongoose.connect('mongodb://localhost:27017/the-spot');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await spotter.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10
        const gymSpot = new spotter({
            author: '68d355c1abf535a07edcbfb0',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Gym Photos',
            price
        })
        await gymSpot.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});