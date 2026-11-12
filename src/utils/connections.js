const ConnectionRequest = require("../models/connectionRequest");

// True if an accepted connection exists between the two users (either direction)
const areConnected = async (userId, otherUserId) => {
    const connection = await ConnectionRequest.findOne({
        status: "accepted",
        $or: [
            { fromUserId: userId, toUserId: otherUserId },
            { fromUserId: otherUserId, toUserId: userId },
        ],
    });
    return Boolean(connection);
};

module.exports = { areConnected };
