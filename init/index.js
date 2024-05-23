const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.error("Connection error:", err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "662772d07a59307a509c7a17" }));// this line of code creates a new array modifiedData where each object from initData.data is cloned, and a new property owner with the value "662772d07a59307a509c7a17" is added to each cloned object


        await Listing.insertMany(initData.data);

        console.log("Data was initialized");
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

initDB();


 //The initDB function is likely intended to be used for initializing or resetting the state
    // of the database by clearing existing data and inserting new data. It's commonly used in 
    //development or testing environments to ensure a clean and consistent state of the database 
    //before running tests or starting the application