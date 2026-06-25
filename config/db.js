const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.Mongo_Db_Url;

const connectDb = async () => {
  try {
    console.log("Connecting...");

    const connect = await mongoose.connect(mongoURI);

    console.log("MongoDB Connected");
    console.log(connect.connection.host);
    console.log(connect.connection.name);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
  }
};

module.exports = connectDb;