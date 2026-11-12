const socket = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Chat } = require("../models/chat.js");
const User = require("../models/user.js");
const { areConnected } = require("./connections.js");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest("hex");
};

// Read the "token" cookie from the socket handshake (cookie-parser only covers HTTP routes)
const getTokenFromCookie = (cookieHeader = "") => {
    const pair = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="));
    return pair ? decodeURIComponent(pair.slice("token=".length)) : null;
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
            credentials: true,
        },
    });

    // Authenticate every connection with the same JWT cookie the REST API uses
    io.use(async (socket, next) => {
        try{
            const token = getTokenFromCookie(socket.handshake.headers.cookie);
            if(!token){
                return next(new Error("Please Login!"));
            }

            const { _id } = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(_id).select("firstName lastName");
            if(!user){
                return next(new Error("User not found"));
            }

            socket.user = user;
            next();
        }
        catch(err){
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        // Identity always comes from the verified token, never from client payloads
        const userId = socket.user._id.toString();

        socket.on("joinChat", async ({targetUserId}) => {
            try{
                if(!(await areConnected(userId, targetUserId))) return;

                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(socket.user.firstName + " joined room " + roomId);
                socket.join(roomId);
            }
            catch(err){
                console.log(err);
            }
        });

        socket.on("sendMessage", async ({targetUserId, text}) => {
            try{
                text = typeof text === "string" ? text.trim() : "";
                if(!text) return;

                if(!(await areConnected(userId, targetUserId))) return;

                const roomId = getSecretRoomId(userId, targetUserId);

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId]},
                });

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();

                const savedMessage = chat.messages[chat.messages.length - 1];
                io.to(roomId).emit("messageReceived", {
                    firstName: socket.user.firstName,
                    lastName: socket.user.lastName,
                    text,
                    timestamp: savedMessage.createdAt,
                });
            }
            catch(err){
                console.log(err);
            }
        });
    });
};

module.exports = initializeSocket;
