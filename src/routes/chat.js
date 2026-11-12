const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const { areConnected } = require("../utils/connections");
const mongoose = require("mongoose");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const {targetUserId} = req.params;
    const userId = req.user._id;

    try{
        if(!mongoose.isValidObjectId(targetUserId)){
            return res.status(400).json({message: "Invalid user id"});
        }
        if(!(await areConnected(userId, targetUserId))){
            return res.status(403).json({message: "You can only chat with your connections"});
        }

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });

        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });

            await chat.save();
        }
        res.json(chat);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Could not load the chat"});
    }
});


module.exports = chatRouter;





