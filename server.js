const fs = require('fs')
const https = require('https')
const path = require('path');
const express = require('express');
const helmet = require('helmet');

require('dotenv').config()

const PORT = 3000;

const confit = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
}

const app = express();

app.use(helmet());

function checkeLogged(req,res,next){
  const isLogged = true;
  if(!isLogged){
    return res.status(401).json({
      error: 'you must first log in'
    })
  }
  next()
}

app.get('/auth/google', (req,res)=>{});

app.get('/auth/google/callback', (req,res)=>{});

app.get('/auth/logout', (req,res)=>{});

app.get('/secret', checkeLogged, (req,res) => {
  return res.send('your token is 44')
})

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


    https.createServer({
      key:  fs.readFileSync('key.pem'),
      cert:  fs.readFileSync('cer.pm')
    }, app).listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  
