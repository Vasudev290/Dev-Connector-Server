const express = require("express");
const Chat = require("../../models/Chat");
const { userAuth } = require("../../middleware/auth");
const chatRouter = express.Router();

chatRouter.get("/chat/:toUserId", userAuth, async (req, res) => {
  const userId = req.user._id;
  const { toUserId } = req.params;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, toUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName emailId",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, toUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ message: "Server error fetching chat" }); 
  }
});
module.exports = chatRouter;
