const express = require("express");
const { userAuth } = require("../../middleware/auth");
const ConnectionRequestModel = require("../../models/ConnectionRequest");
const User = require("../../models/User");
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

//Feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;

    //Pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //Find all connection requests
    const allConnectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId  toUserId");

    //Hide the other users
    const hideUsersFromFeed = new Set();
    allConnectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    //find new User
    const findUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ message: "Got the feed", User_Feed_Data: findUsers });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get the Feed Data!!",
      error: error.message,
    });
  }
});
module.exports = userRouter;
