const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;

    const conn_url = await mongoose.connect(MONGO_URL  , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
  
module.exports = {
  connectDB
};
