const express = require("express");
const { userAuth } = require("../../middleware/auth");
const ConnectionRequestModel = require("../../models/ConnectionRequest");
const User = require("../../models/User");
const requestRouter = express.Router();

//SendconnectionRequest
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //Status Validation
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid statue type:" + status });
      }

      //toUserId Validation
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      //if there is an existing ConnectionRequest Validation
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists!!" });
      }

      const connectionReqdata = await connectionRequest.save();
      res.status(200).json({
        message:
          status === "interested"
            ? `${req.user.firstName} has shown interest and successfully sent a connection request to ${toUser.firstName}!`
            : `${req.user.firstName} has ignored the connection request to ${toUser.firstName}.`,
        Connection_Req_Details: connectionReqdata,
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to send the request!!",
        error: error.message,
      });
    }
  }
);
module.exports = requestRouter;
