const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        // Creating a new instance of the user model
        const user = new User({firstName, lastName, emailId, password: passwordHash});

        await user.save();
        res.send("User added successfully!!")
    }
    catch(err){
        res.status(400).send("ERROR:"+ err.message);
    }
});


app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token = await user.getJWT();

            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
            res.send("Login Successful!!");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});


app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;
    
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    console.log("Sending the Connection Request");
    res.send(user.firstName +  " sent the connection request!");
});

connectDB().then(() => {
    console.log("Database Connected Successfully...");
    app.listen(3000, () => {
        console.log("Server is listening successfully on port 3000");
    });
}).catch(err => {
    console.log("Database Cannot Connected.")
})




