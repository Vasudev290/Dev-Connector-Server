const express = require("express");
const { userAuth } = require("../../middleware/auth");
const ConnectionRequestModel = require("../../models/ConnectionRequest");
const User = require("../../models/User");
const requestRouter = express.Router();
const sendEmail = require("../../utils/sendEmail");

//SendconnectionRequest
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //Status Validation Case Corner
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid statue type:" + status });
    }

    //toUserId Validation
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    //if there is an existing ConnectionRequest Validation Case Corner
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
    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const connectionReqdata = await connectionRequest.save();

    let emailRes = null;

    if (status === "interested") {
      const subject = "Connection Request on DevConnector";
      const body = `${req.user.firstName} has sent you a connection request on DevConnector.`;

      try {
        emailRes = await sendEmail.run(subject, body, toUser.emailId);
        // console.log("Email sent:", emailRes?.MessageId ?? "Success!");
      } catch (err) {
        console.error("Email failed:", err);
      }
    }
    return res.status(200).json({
      message:
        status === "interested"
          ? `${req.user.firstName} has sent a connection request to ${toUser.firstName}!`
          : `${req.user.firstName} has ignored the connection request to ${toUser.firstName}.`,
      emailStatus:
        status === "interested"
          ? {
              success: !!emailRes,
              messageId: emailRes?.MessageId ?? null,
              rawResponse: emailRes ?? null,
            }
          : null,
      Connection_Req_Details: connectionReqdata,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to send the request!!",
      error: error.message,
    });
  }
});

//ConnectionRequestReview
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { status, requestId } = req.params;

    //Statues Check Case Corner
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `${status} not allowed!` });
    }
    //Connection Request Check
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId toUserId", "firstName lastName emailId");
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request not found!" });
    }
    connectionRequest.status = status;
    const modifiedConnectionRequest = await connectionRequest.save();

    let emailStatus = null;
    if (status === "accepted") {
      const subject = "Your connection request has been accepted!";
      const body = `${user.firstName} has accepted your connection request on DevConnector.`;
      try {
        emailStatus = await sendEmail.run(
          subject,
          body,
          connectionRequest.fromUserId.emailId
        );
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }
    return res.status(200).json({
      message: `Connection request ${status} successfully!`,
      reviewStatus: status,
      connectionDetails: modifiedConnectionRequest,
      emailStatus:
        status === "accepted"
          ? {
              success: !!emailStatus,
              messageId: emailStatus?.MessageId ?? null,
              rawResponse: emailStatus ?? null,
            }
          : null,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to Review the Connection request!!",
      error: error.message,
    });
  }
});

module.exports = requestRouter;
