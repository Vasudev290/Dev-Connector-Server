const express = require('express');
const { userAuth } = require('../../middleware/auth');
const requestRouter = express.Router();


//SendconnectionRequest
requestRouter.post("/sendConnectReq", userAuth, async (req, res) => {
  const user = req.user;
  res.json({
    message: `${user.firstName} sends the connection request!`,
    User_Request_Details: user,
  });
});
module.exports = requestRouter;