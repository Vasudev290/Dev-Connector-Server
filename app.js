const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello Server🚀🚀");
});

//Listen server
app.listen(6969, () => {
  console.log("Server started and running successfully!");
});
