const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../../middleware/auth");
const {
  validateProfileEditData,
  validatePasswordData,
} = require("../../utils/validation");
const profileRouter = express.Router();

//Profile
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({
      message: "Data failed to see the user's login details",
      error: error.message,
    });
  }
});

//Profile/edit
profileRouter.put("/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request!");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.status(200).json({
      message: `${user.firstName} your profile updated successful!`,
      Updated_Details: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Data failed to edit the details!",
      error: error.message,
    });
  }
});

//Profile/password
profileRouter.put("/password", userAuth, async (req, res) => {
  try {
    if (!validatePasswordData(req)) {
      throw new Error(
        "Invalid edit password request! Only 'password' can be updated."
      );
    }
    const user = req.user;
    const plainPassword = req.body.password;

    //Hash the new password!
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    //update and save
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      message: `${user.firstName} your password updated successful!`,
      Password_Updated_Details: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update the password!",
      error: error.message,
    });
  }
});

module.exports = profileRouter;
