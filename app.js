const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/authRouter/auth");
const profileRouter = require("./src/routes/profileRouter/profile");
const requestRouter = require("./src/routes/requestRouter/request");
const app = express();

//middleware:- json, cookie-parser
app.use(express.json());
app.use(cookieParser());

//Router
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", requestRouter);

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
