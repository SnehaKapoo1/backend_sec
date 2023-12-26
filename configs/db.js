

const mongoose = require("mongoose");
require("dotenv").config();

// const MONGO_URL = process.env.MONGO_DATABASE;
const MONGO_URL = process.env.MONGO_DATABASE

// const MONGO_URL = "mongodb://127.0.0.1/policeWala"

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URL)
    console.log("Successfully Connected to MongoDB For Food_Delivery App");
    return connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

module.exports = connectToDatabase;
