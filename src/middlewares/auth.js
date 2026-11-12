const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        // Read the token from the req cookies
        const {token} = req.cookies;

        if(!token){
            return res.status(401).send("Please Login!");
        }
    
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

        const {_id} = decodedObj;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next();
    }
    catch(err){
        // Invalid/expired token or missing user: the frontend logs out on 401
        res.status(401).send("ERROR: " + err.message);
    }
};

module.exports = {userAuth};




