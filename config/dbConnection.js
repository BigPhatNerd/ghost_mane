const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB...", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
