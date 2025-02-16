const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat.js");
const ConnectionRequest = require("../models/connectionRequest.js");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({firstName, userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);

            console.log(firstName +  " joined room " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({firstName, lastName, userId, targetUserId, text}) => {
            try{
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(firstName + " " + text);

                // TODO: Check if userId and targetUserId are friends 
                // ConnectionRequest.findOne({fromUserId: userId, toUserId: targetUserId, status: "accepted"}) 

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
                io.to(roomId).emit("messageReceived", {firstName, lastName, text});
            }
            catch(err){
                console.log(err);
            }
        });
        socket.on("disconnect", () => {

        });
    });
};

module.exports = initializeSocket;




