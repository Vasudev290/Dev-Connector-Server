const express = require("express");
const {adminAuth, userAuth} = require("./middleware/auth");


const app = express();

// app.get("/user", (req, res, next) => {
//   console.log("Hnadling the route user 2!!");
//   res.send("2nd Response!!");
//   //next()
// });

// app.get("/user", (req, res, next) => {
//   console.log("Hnadling the route user 1!!");
//   res.send("Response!!");
//   next();
// });

// app.use("/", (req, res, next) => {
//res.send("Handling / route");
//   next()
// });

// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("1st route handler");
//     next();
//   },
//   (req, res, next) => {
//     console.log("2nd route handler");
//     res.send("Response 1!!");
//     next();
//   },
//   (req, res, next) => {
//     console.log("3nd route handler");
//     res.send("Response 2!!");
//     next();
//   }
// );

app.use("/admin", adminAuth);

app.get('/user', userAuth, (req, res, next) => {
  res.send("user has get!")
});

app.get('/admin/getAllUser', (req, res, next) => {
  res.send("all data has get!")
})

app.get('/admin/deleteUser', (req, res, next) => {
  res.send("Deleted the user!")
})

//Listen server
app.listen(6969, () => {
  console.log("Server started and running successfully!");
});
