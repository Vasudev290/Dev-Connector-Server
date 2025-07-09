const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invaild Token!");
    }
    //validate the token verify
    const decodedDataObj = await jwt.verify(token, "DEV@connector$79031");
    const { _id } = decodedDataObj;
    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    next(); 
  } catch (error) {
    res.status(400).json({
      message: "Data failed to post the login details",
      error: error.message,
    });
  }
};

module.exports = { userAuth };
