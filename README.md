# Creating Server
-Create a repository
-Initailize the repository
-node-modules, package-lock.json, package.json
-install express
-create server
-Listen to port 6969
-write request handlers for /, /test, /hello
-install nodemon and update script inside package.json

# gitignore, create server, normal router & test Postman
-initialize git
-gitignore
-create a remote repo on github
-push all code to remote origin
-play with routes and route extentsions ex; /hello, /hello/123
-Order of the routes matter a lot
-install postman app and make a workspace > test API call
-write logic to handle GET, POST, PUT, DELETE API CALLS and test them on postman
-Explore routing and use of ?, +, (), * in the routes
-use od regEx in routes /a/ /.*fly$/
-reading the queuy params in the routes
-reading the dynamic routes

# Req and Res
-Multiple route handler = play with the code
-next()
-next function and errord along with res.send()
-what is a middlewere
-how express JS basically handles request behind the scenes
-diff b/w app.use and app.all
-write a dummy auth and user middleware for all user routes, expect /user, /login
-Error handling using app/use("/", (err, req, res, next) => {});

# MongoDB Atlas Connections
-Create a free cluster on mongoDB official website (MongoDB Atlas)
-Install Mongoose library
-Connect your application to the Database "connection-url"/dev-connector"
-Call the MongoDB connectDB function and connect to database before straing application on 6969

# Schema process
- Create a User Schema & userModel
  -Create Post api call /signup api to add data to database
  -push some documets using api calls from postman
  -Error Hnadling using try, catch
-js object vs JSON (diff b/w)
-Add the express.json() middleware to your app
-Make your sigup API dynamic to recive data from the end user(postman, browser, etc.,)
User.findOne with duplucate email ids, which object returned

# API setup
-API- Get user by email
-API - Feed API - GET /feed - get all the users from the database
-API - Get user by ID
-Create a delete user API
-Difference between PATCH and PUT
-API - Update a user
-Explore the Mongoose Documention for Model methods
-What are options in a Model.findOneAndUpdate method, explore more about it
-API - Update the user with email ID
-Explore schematype options from the documention
-add required, unique, lowercase, min, minLength, trim
-Add default
-Create a custom validate function for gender
-Improve the DB schema - PUT all appropiate validations on each field in Schema
-Add timestamps to the userSchema

# Understand the HTTP Methods
-Add API level validation on Patch request & Signup post api
-DATA Sanitizing - Add API validation for each field
-Install validator
-Explore validator library funcation and Use vlidator funcs for -password, email, photoURL
-NEVER TRUST req.body
-Validate data in Signup API

# Authentication Bcrypt / Jsonwebtoken
-Install bcrypt package
-Create PasswordHash using bcrypt.hash & save the user is excrupted password
-Create login API
-Compare passwords and throw errors if email or password is invalid
-install cookie-parser
-just send a dummy cookie to user
-create GET /profile APi and check if you get the cookie back
-install jsonwebtoken
-In login API, after email and password validation, create e JWT token and send it to user in cookies
-read the cookies inside your profile API and find the logged in user
-userAuth Middleware
-Add the userAuth middle ware in profile API and a new sendConnectionRequest API
-Set the expiry of JWT token and cookies to 7 days
-Create userSchema method to getJWT()
-Create UserSchema method to comparepassword(passwordInputByUser)
-Explore tinder APIs


# Router
Create a list all API you can think of in Dev Tinder

Group multiple routes under repective routers

Read documentation for express.Router

Create routes folder for managing auth,profile, request routers

create authRouter, profileRouter, requestRouter

Import these routers in app.js

Create POST /logout API

Create PATCH /profile/edit

Create PATCH /profile/password API => forgot password API

Make you validate all data in every POST, PATCH apis

Create Connnection Request Schema

Send Connection Request API

Proper validation of Data

Think about ALL corner cases

$or query $and query in mongoose - https://www.mongodb.com/docs/manual/reference/operator/query-logical/

schema.pre("save") function

Read more about indexes in MongoDB

Why do we need index in DB?

What is the advantages and disadvantage of creating?

Read this arcticle about compond indexes - https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/

ALWAYS THINK ABOUT CORNER CASES

Write code with proper validations for POST /request/review/:status/:requestId

Thought process - POST vs GET

Read about ref and populate https://mongoosejs.com/docs/populate.html

Create GET /user/requests/received with all the checks

Create GET GET /user/connections

Logic for GET /feed API

Explore the $nin , $and, $ne and other query operatorators

Pagination

NOTES:

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

/feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)

skip = (page-1)\*limit;
