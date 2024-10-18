const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    // Creating a new instance of the user model
    const user = new User({
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "virat@kohli.com",
        password: "virat@123",
    });

    try{
        await user.save();
        res.send("User added successfully!!")
    }
    catch(err){
        res.status(400).send("Error saving the user:"+ err.message);
    }
});

connectDB().then(() => {
    console.log("Database Connected Successfully...");
    app.listen(3000, () => {
        console.log("Server is listening successfully on port 3000");
    });
}).catch(err => {
    console.log("Database Cannot Connected.")
})



