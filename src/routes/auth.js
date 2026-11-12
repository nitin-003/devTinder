const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {getCookieOptions} = require("../utils/cookie");

authRouter.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating a new instance of the user model
        const user = new User({firstName, lastName, emailId, password: passwordHash});

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {...getCookieOptions(), expires: new Date(Date.now() + 8 * 3600000)});
        
        res.json({message: "User added successfully!!", data: savedUser })
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token = await user.getJWT();

            res.cookie("token", token, {...getCookieOptions(), expires: new Date(Date.now() + 8 * 3600000)});
            res.send(user);
            // res.send("Login Successful!!");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.clearCookie("token", getCookieOptions());

    res.send("Logout Successful!!");
});

module.exports = authRouter;



