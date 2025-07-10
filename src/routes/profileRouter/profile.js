const express = require("express");
const { userAuth } = require("../../middleware/auth");
const profileRouter = express.Router();

//Profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({
      message: "Data failed to post the login details",
      error: error.message,
    });
  }
});

module.exports = profileRouter;
