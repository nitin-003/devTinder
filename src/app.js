const express = require("express");
const app = express();

app.get("/getUserData", (req, res) => {
    try{
        throw new Error("ddfgh");
        res.send("User Data Sent");
    }
    catch(err){
        res.status(500).send("Some error contact support team");
    }
});

app.use("/", (err, req, res, next) => {
    if(err){
        // log your error
        res.status(500).send("Something went wrong!!");
    }
});

app.listen(3000, () => {
    console.log("Server is listening successfully on port 3000");
});




