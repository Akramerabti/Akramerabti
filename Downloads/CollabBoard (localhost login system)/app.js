const express = require("express") //requires express.js
const app = express() //Launches express.js
const path=require("path")
const ejs =require("ejs")
const bodyParser = require("body-parser"); // Don't forget to require the body-parser THIS WAS THE BIG ERROR WE NEED TO PARSE TO GET DATA
const port = process.env.PORT || 3000
const nodemailer = require('nodemailer');
const authRoutes = require("./routes/authroutes");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser middleware THIS WAS THE BIG ERROR WE NEED TO PARSE TO GET DATA


app.use(express.static("/public")) //Helps get mongodb data
app.use(express.json())
const templatePath=path.join(__dirname, '/templates') //Joins all folllowing names to the templates files
const publicPath = path.join(__dirname, '/public')


app.set('view engine', 'ejs') //Setting the "view engine" name default by express.js as "hbs"
app.set('views',templatePath) //Settomg the "views" name default by express.js as templatepath, which is the directory of the templates folder
console.log(publicPath);
app.use(authRoutes)

mongoose.connect("mongodb+srv://Akramvd:lF9UjtVXF0iWsxetr2MK@cluster0.7wctpqm.mongodb.net/appdatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }) //Used to connect the node of our local hosting network to mongodb database with the name after the local host setup
.then(()=>{
    console.log("mongoose connected"); //Prints connection if it works
})
.catch(()=>{
    console.log("failed to connect to database"); //Prints connection if it didn't work
});


app.get('/', (req,res) => {//when you write just local host 3000, sets up the main location in the templates folder to be ... the thing below (res.render), which is home
    res.render('home'); //FETCHES HOME FILE IN PUBLIC FOLDER
}) 

app.get("/whiteboard",(req,res) => {// gets http://localhost:3000    "/whiteboard" page is the whiteboard.ejs public file
    res.render('whiteboard'); //FETCHES WHITEBOARD FILE IN PUBLIC FOLDER
}) 

app.listen(port ,() => { //Asks express.js to listen to port #3000 (TCP port for running web applications), 2nd parameter is the function
    console.log("Port connected");  // Affirms port connection

})

// COOKIES DEF : stores data of browser then is sent back to server and we can access it, cookie holds jwt token to identify user
//const cookieParser = require('cookie-parser');
//app.use(cookieParser());

//app.get('/set-cookies', (req, res) => { // Creates a cookie

  // to create value from database as cookie until session is closed:  OR res.setHeader('Set-Cookie', 'newUser=true');
  
  //es.cookie('newUser', false); // creating new cookie newUser variable and setting to false 
  //res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }); //new cookies with properties (maxAge is the time of the value in the session, the # are in ms, this is one day, so it expires after a day  )
  // can use "secure" property object for it to be present only in https
  //httpOnly means it is inaccessible via javascript, so just transferable via http protocol not java front end

  //res.send('you got the cookies!');

//app.get('/read-cookies', (req, res) => {

  //const cookies = req.cookies;
 // console.log(cookies.newUser); // gets the value of the cookie newUser

  //res.json(cookies); // passes it as json to the browser isEmployee we can see it as well.


  
