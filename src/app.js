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
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
.then(() => {
    console.log("Database Connected Successfully...");
    app.listen(process.env.PORT, () => {
        console.log("Server is listening successfully on port 3000");
    });
})
.catch(err => {
    console.log("Database cannot be connected.", err);
})


