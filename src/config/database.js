const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET,
    { writeConcern: { w: "majority" } }
    );
}


module.exports = connectDB;




