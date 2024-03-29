const express = require('express');
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const app = express();
const path=require("path")
const ejs =require("ejs")

app.use(cookieParser()) // necessary to parse cookie into readable format


const requireAuth = (req, res, next) => { // function with three attributes

  const token = req.cookies.jwt; // request authentification cookie

  // check json web token exists & is verified
  if (token) {

    jwt.verify(token, 'I swear to god no one should no this and no one will ever do', (err, decodedToken) => { // same signature than the jwt signature since we want to recreate the jwt token to validate
      if (err) {
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next(); // means that if they have the token, they can continue with what they wanted
      }
    });
  } else {
    res.redirect('/login'); // just in case 
  }
};

//Checking user 

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

  
  module.exports = { requireAuth, checkUser};