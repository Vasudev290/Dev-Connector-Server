// db.js
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_DB_URI_LINK;
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
};

module.exports = connectDB;
