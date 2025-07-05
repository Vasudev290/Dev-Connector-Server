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

-Multiple route handler = play with the code
-next()
-next function and errord along with res.send()
-what is a middlewere
-how express JS basically handles request behind the scenes
-diff b/w app.use and app.all
-write a dummy auth and user middleware for all user routes, expect /user, /login
-Error handling using app/use("/", (err, req, res, next) => {});

-Create a free cluster on mongoDB official website (MongoDB Atlas)
-Install Mongoose library
-Connect your application to the Database "connection-url"/dev-connector"
-Call the MongoDB connectDB function and connect to database before straing application on 6969
- Create a User Schema & userModel
-Create Post api call /signup api to add data to database
-push some documets using api calls from postman
-Error Hnadling using try, catch