const mongoose = require('mongoose');
const Blog = require('../models/bloging');
const data = require('./data');   


require("dotenv").config({ path: "../.env" });


//connect to MongoDB
const mongo_URL = process.env.MONGO_URL;
async function main(){
    await mongoose.connect(mongo_URL);
}

main()
.then(() => {
    console.log('Connected to DB');
})
.catch((err) => {
    console.error('Error', err);
});



const initDB = async () => {
    await Blog.deleteMany({}); // Clear existing data
    await Blog.insertMany(data.data);
    console.log('Database initialized with sample data');

    await mongoose.connection.close(); // Close the connection after initialization
    console.log('Database connection closed');
}   

initDB()
.then(() => {
    console.log('Database initialization complete');
});