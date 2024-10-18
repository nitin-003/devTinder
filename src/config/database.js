const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb://nitinpathak01:Nitin7851@devtinder-shard-00-00.p6pn0.mongodb.net:27017,devtinder-shard-00-01.p6pn0.mongodb.net:27017,devtinder-shard-00-02.p6pn0.mongodb.net:27017/?ssl=true&replicaSet=atlas-37p886-shard-0&authSource=admin&retryWrites=true&w=majority&appName=devTinder");
}

module.exports = connectDB;




