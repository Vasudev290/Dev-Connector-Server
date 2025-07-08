const express = require("express");
const connectDB = require("./src/Config/db");
const User = require("./src/models/User");
const { validateSignUpData } = require("./src/utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

//middleware josn, cookie-parser
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
    console.log(passwordHash);

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
    const isPasswordValid = await bcrypt.compare(password, userVaild.password);
    if (!isPasswordValid) {
      throw new Error("Invaild Credentials!");
    } else {
      //Create aJWT Token
      const token = jwt.sign({ _id: userVaild._id }, "DEV@connector$79031");

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);
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
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token){
      throw new Error("Invaild Token!")
    }
    //Validate the token
    const decodedMessage = await jwt.verify(token, "DEV@connector$79031");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
      throw new Error("User does not exist!")
    }
    res.send(user);
  } catch (error) {
    res.status(400).json({
      message: "Data failed to post the login details",
      error: error.message,
    });
  }
});

//Find one user with email
//Read Get-Data
app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const userEmailId = await User.findOne({ emailId: emailId });
    if (!userEmailId) {
      res.status(404).json({ message: "User is nort found!" });
    }
    res
      .status(200)
      .json({ message: "User Details found", userEmail: userEmailId });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Data failed to get the user", error: error.message });
  }
});

//Read
app.get("/signup", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Get all the posted data",
      no_of_data: users.length,
      userDetails: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Data failed to get", error: error.message });
  }
});

//update
app.put("/signup/:id", async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdatedAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdatedAllowed) {
      throw new Error("Update not allowed!");
    }

    if (req.body?.skills.length > 12) {
      throw new Error("Skills cannot be more then 12! ");
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User details not found!" });
    }

    res.status(200).json({
      message: "User updated successfully!",
      updated_details: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to update user", error: error.message });
  }
});

//Delete
app.delete("/signup/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res.status(404).json({ message: "User Details not found" });
    }
    res.status(200).json({
      message: "User Deleted successfully!",
      User_Details: deleteUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
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
