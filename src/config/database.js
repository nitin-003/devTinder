const mongoose = require("mongoose");

const connectDB = async () => {
    const connectionString = process.env.CONNECTION_STRING;
    await mongoose.connect(connectionString);
}

module.exports = connectDB;





