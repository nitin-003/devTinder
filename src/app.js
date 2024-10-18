const express = require("express");

const app = express();

app.use("/user", 
    (req, res, next) => {
    // Route handler  
    // res.send("Route Handler 1");
    console.log("Handling the route user 1!")
    next();
    },
    (req, res, next) => {
        console.log("Handling the route user 2!")
        next();
       //  res.send("Route Handler 2")
    },
    (req, res, next) => {
        console.log("Handling the route user 3!")
        next();
        // res.send("Route Handler 3")
    },
    (req, res, next) => {
        console.log("Handling the route user 4!")
        // next();
        res.send("Route Handler 4")
    }
);

app.listen(3000, () => {
    console.log("Server is listening successfully on port 3000");
});




