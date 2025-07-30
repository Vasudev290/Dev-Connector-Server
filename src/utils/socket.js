const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/Chat");

// Sort IDs to ensure consistent room ID regardless of who initiates
const getSecretRoomId = (userId, toUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, toUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "https://devconnector.info"],
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    //Event Handlers: User joins the chat room
    socket.on("joinChat", ({ firstName, lastName, userId, toUserId }) => {
      const roomId = getSecretRoomId(userId, toUserId);
      console.log(
        `${firstName} ${lastName} (ID: ${userId}) Joining room: ${roomId}`
      );
      socket.join(roomId);
    });
    socket.on(
      "sendMessages",
      async ({ firstName, lastName, userId, toUserId, text }) => {
        //Save message to the database
        try {
          const roomId = getSecretRoomId(userId, toUserId);
          console.log(
            `${firstName} ${lastName} (ID: ${userId}) sent: "${text}" to room: ${roomId}`
          );
          let chat = await Chat.findOne({
            participants: { $all: [userId, toUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, toUserId],
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
            firstName,
            lastName,
            text,
            senderId: userId,
            timeStamp: savedMessage.createdAt,
            _id: savedMessage._id,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
