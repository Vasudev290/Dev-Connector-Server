const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const authRouter = require("./src/routes/authRouter/auth");
const profileRouter = require("./src/routes/profileRouter/profile");
const requestRouter = require("./src/routes/requestRouter/request");
const userRouter = require("./src/routes/userRouter/user");
const paymentRouter = require("./src/routes/paymentRouter/payment");
const initializeSocket = require("./src/utils/socket");
const chatRouter = require("./src/routes/chatRouter/chat");

const app = express();

//Cron Job
require("./src/utils/cronJobs");

//middleware:- json, cookie-parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://devconnector.info"],
    credentials: true,
  })
);

//Router
app.use("/api", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);
app.use("/api", chatRouter);

//Error check
app.use((req, res, next) => {
  res.status(404).json({ error: "Route Not Found", path: req.originalUrl });
});

//Database Connection
const MONGO_URI = process.env.MONGO_DB_URI_LINK;
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
};

//Config Server in webSocket.io
const server = http.createServer(app);

//WebSocket.io
initializeSocket(server);

//Database Connected
connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully! 🚀🚀");
    //Listen server
    server.listen(process.env.PORT, () => {
      console.log(
        `Server started and running on ${process.env.PORT} successfully! 🔥🔥🚀🚀`
      );
    });
  })
  .catch((err) => {
    console.error("Database not connected properly!", err.message);
  });
