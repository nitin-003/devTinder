const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    // Creating a new instance of the user model
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added successfully!!")
    }
    catch(err){
        res.status(400).send("Error saving the user:"+ err.message);
    }
});

// GET user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
       
        // if(users.length === 0){
        //     res.status(404).send("User not found");
        // }
        // else{
        //     res.send(users);
        // }
    }
    catch(err){
        res.status(400).send("Something went wrong!!");
    }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong!!");
    }
});

// Delete data of the user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        // const user = await User.findByIdAndDelete({_id: userId});
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully...")
    }
    catch(err){
        res.status(400).send("Something went wrong!!");
    }
});

// Update data of the user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId, data);
       // await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "after"});
       // console.log(user);
       res.send("User Updated Successfully...");
    }
    catch(err){
        res.status(400).send("Something went wrong!!");
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



