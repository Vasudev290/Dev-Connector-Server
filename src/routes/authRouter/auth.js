const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../../utils/validation");
const User = require("../../models/User");

//Signup
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password,
      photoUrl,
      about,
      skills,
    } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const userObj = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: passwordHash,
      photoUrl,
      about,
      skills,
    });
    const userData = await userObj.save();
    res
      .status(200)
      .json({
        message: "New user data posted successfull",
        New_User_Details: userData,
      });
  } catch (err) {
    res
      .status(401)
      .send({ message: "User failed to post the data!", error: err.message });
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userVaild = await User.findOne({ emailId: emailId });
    if (!userVaild) {
      throw new Error("Invaild Credentials!");
    }
    const isPasswordValid = await userVaild.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invaild Credentials!");
    } else {
      //Create a JWT Token
      const token = await userVaild.getJWT();

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({ message: "Login Successfull!", Login_User_Details: userVaild });
    }
  } catch (error) {
    res.status(400).json({
      message: "Data failed to post the login details",
      error: error.message,
    });
  }
});

//logout
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("User logout successfullly!");
  } catch (error) {
    res.status(400).json({
      message: "User failed to logout",
      error: error.message,
    });
  }
});

module.exports = authRouter;
