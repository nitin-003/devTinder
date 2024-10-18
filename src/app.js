const express = require("express");

const app = express();

// This will only handle the GET call to /user
app.get("/user", (req, res) => {
    res.send({firstName: "Nitin", lastName: "Pathak"});
}); 

app.post("/user", (req, res) => {
    // saving data to DB
    res.send("Data successfully saved to the database!");
}); 

// This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send("Hello from the server!!");
}); 

app.listen(3000, () => {
    console.log("Server is listening successfully on port 3000");
});


