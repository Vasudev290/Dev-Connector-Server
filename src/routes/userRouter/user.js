const express = require("express");
const { userAuth } = require("../../middleware/auth");
const ConnectionRequestModel = require("../../models/ConnectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills";

//Get all the pending connection request for the loggedIn user;
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionReqdata = await ConnectionRequestModel.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.status(200).json({
      message: "Connection Request Data fetched Successfull!",
      Fetched_Data_Details: connectionReqdata,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to Requested the Connection!!",
      error: error.message,
    });
  }
});

//Connection Request
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const modifiedMapConnectionData = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "Got the connection Request!",
      Connection_data: modifiedMapConnectionData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get the Requested the Connection!!",
      error: error.message,
    });
  }
});

module.exports = userRouter;
