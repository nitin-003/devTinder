const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const models = require("./models/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
.then(() => {
    console.log("Database Connected Successfully...");
    app.listen(3000, () => {
        console.log("Server is listening successfully on port 3000");
    });
})
.catch(err => {
    console.log("Database Cannot Connected.")
})


