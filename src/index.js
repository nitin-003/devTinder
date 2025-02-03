const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/userRouter");
const models = require("./models/user");
const cors = require("cors");

require("dotenv").config();

app.use(
    cors({
        origin: "https://dev-tinder-frontend-orpin.vercel.app/",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectDB()
.then(() => {
    console.log("Database Connected Successfully...");
    app.listen(3000, () => {
        console.log("Server is listening successfully on port 3000");
    });
})
.catch(err => {
    console.log("Database Cannot Connected.", err);
})




