const express = require("express");
const connectDB = require("./src/Config/db");
const User = require("./src/models/User");
const { validateSignUpData } = require("./src/utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./src/middleware/auth");
const app = express();

//middleware:- json, cookie-parser
app.use(express.json());
app.use(cookieParser());

//Create
app.post("/signup", async (req, res) => {
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
      .json({ message: "Data posted successfull", userDetails: userData });
  } catch (err) {
    res
      .status(401)
      .send({ message: "Data failed to posted", error: err.message });
  }
});

//login
app.post("/login", async (req, res) => { 
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
      res.status(200).json({ message: "Login Successfull!!!!" });
    }
  } catch (error) {
    res.status(400).json({
      message: "Data failed to post the login details",
      error: error.message,
    });
  }
});

//Profile
app.get("/profile", userAuth, async (req, res) => {
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

//SendconnectionRequest
app.post("/sendConnectReq", userAuth, async (req, res) => {
  const user = req.user;
  res.json({
    message: `${user.firstName} sends the connection request!`,
    User_Request_Details: user,
  });
});

//Database Connected
connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully! 🚀🚀");
    //Listen server
    app.listen(process.env.PORT, () => {
      console.log(
        `Server started and running on ${process.env.PORT} successfully! 🔥🔥🚀🚀`
      );
    });
  })
  .catch((err) => {
    console.error("Database not connected properly!", err.message);
  });
