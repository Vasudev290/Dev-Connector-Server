const express = require("express");

const app = express();

app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Vasu", lastName: "Dev" });
});
//Listen server
app.listen(6969, () => {
  console.log("Server started and running successfully!");
});
