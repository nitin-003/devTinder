const express = require("express");

const app = express();

// This will only handle the GET call to /user
app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({firstName: "Nitin", lastName: "Pathak"});
}); 

app.listen(3000, () => {
    console.log("Server is listening successfully on port 3000");
});




