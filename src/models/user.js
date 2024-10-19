const mongoose = require("mongoose");
const validator = require("validator");

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
            validate(value){
                if(!["male", "female", "others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
            },
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

const User = mongoose.model("User", userSchema);
module.exports = User;



