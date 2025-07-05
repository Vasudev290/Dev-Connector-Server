const express = require("express");
const connectDB = require("./Config/db");
const User = require("./models/User");
const app = express();


app.use(express.json());

//Create
app.post("/signup", async (req, res) => {
  try {
    const userObj = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      gender: req.body.gender,
      emailId: req.body.emailId,
      password: req.body.password,
    });
    const userData = await userObj.save();
    res
      .status(200)
      .json({ message: "Data posted successfull", userDetails: userData });
  } catch (err) {
    res.status(401).send({ message: "Data failed to posted" });
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
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User details not found!" });
    }
    res
      .status(200)
      .json({
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
    res.status(200).json({ message: "User Deleted successfully!", User_Details: deleteUser });
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
