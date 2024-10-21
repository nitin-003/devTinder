const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            minLength: 4,
            maxLength: 50,
            required: true,
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email address: " + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a Strong Password: " + value);
                }
            },
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "others"],
                message: `{VALUE} is not a valid gender`,
            },
            // validate(value){
            //     if(!["male", "female", "others"].includes(value)){
            //         throw new Error("Gender data is not valid");
            //     }
            // },
        },
        photoUrl: {
            type: String,
            default: "https://www.pngall.com/wp-content/uploads/5/Profile-Male-Transparent.png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid photo URL: " + value);
                }
            },
        },
        about: {
            type: String,
            default: "This is a default about of user!",
        },
        skills: {
            type: [String],
        }
    },
    {
        timestamps: true,
    }
);

userSchema.index({firstName: 1});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@TINDER$790", {expiresIn: "1d"});

    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
};


const User = mongoose.model("User", userSchema);
module.exports = User;




