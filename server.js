const fs = require('fs')
const https = require('https')
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const cookieSession = require('cookie-session')
const {Strategy} = require('passport-google-oauth20');


require('dotenv').config()

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY1: process.env.COOKIE_KEY1,
  COOKIE_KEY2: process.env.COOKIE_KEY2,
}

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done){
  console.log('Google progile', profile);
  done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))
const app = express();

app.use(helmet());
app.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: [config.COOKIE_KEY1, config.COOKIE_KEY2]
}))
app.use(passport.initialize())

function checkeLogged(req,res,next){
  const isLogged = true;
  if(!isLogged){
    return res.status(401).json({
      error: 'you must first log in'
    })
  }
  next()
}

app.get('/auth/google', passport.authenticate('google',{
  scope:['email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/failure',
  successRedirect: '/',
  session: false
}), (req, res)=>{
  console.log('Google called back');
});

app.get('/auth/logout', (req,res)=>{});

app.get('/secret', checkeLogged, (req,res) => {
  return res.send('your token is 44')
})

app.get('/failure', (req,res)=>{
  return res.send('Failure to authenticate')
});

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


    https.createServer({
      key:  fs.readFileSync('key.pem'),
      cert:  fs.readFileSync('cer.pm')
    }, app).listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  
