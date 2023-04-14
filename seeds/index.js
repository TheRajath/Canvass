if (process.env.NODE_ENV !== "production") {

    require('dotenv').config();
}
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect(process.env.DATA_SOURCE_DEV);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {

    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {

        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '6438d6ba41b38d76b8c6cfce',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgfwiqvlx/image/upload/v1680712392/Canvass/p8rpond6qt6gxb0jol3s.jpg',
                    filename: 'Canvass/p8rpond6qt6gxb0jol3s'
                },
                {
                    url: 'https://res.cloudinary.com/dgfwiqvlx/image/upload/v1680712395/Canvass/s61e6wbr2ivmzwkt5svg.jpg',
                    filename: 'Canvass/s61e6wbr2ivmzwkt5svg'
                }
            ]
        });

        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});
