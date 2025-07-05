const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res, next) => {
    //res.send("Response!!");
    next()
  },
  (req, res, next) => {
    //res.send("2nd Response!!");
    next()
  },
  (req, res, next) => {
    //res.send("3nd Response!!");
    next()
  },
   (req, res, next) => {
    //res.send("4nd Response!!");
    next()
  },
   (req, res, next) => {
    //res.send("5nd Response!!");
    //next()
  }
);

//Listen server
app.listen(6969, () => {
  console.log("Server started and running successfully!");
});
