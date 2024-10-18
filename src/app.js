const express = require("express");
const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth");

// Handle auth middleware for all GET, POST, ... requests
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
    res.send("User Data Sent");
});

app.get("/admin/getAllData", (req, res) => {
    // Check if request is authorized
    res.send("All Data Sent");
});

app.listen(3000, () => {
    console.log("Server is listening successfully on port 3000");
});



