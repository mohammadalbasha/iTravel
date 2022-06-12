//importing 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// my packages 
const db = require('./db');
const authRoutes = require('./routes/auth');
const countriesRoutes = require('./routes/countries');
const restaurantsRoutes = require('./routes/restaurants');

const app = express();

// serving static images 
app.use('/images', express.static(path.join(__dirname,'images')));

app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
//reading data from reauest as a JSON
app.use(bodyParser.json());


// solving the cors issue
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  

app.get('/' , (req,res,next) => {res.send("hello world")});

//routes 
app.use('/auth', authRoutes);
app.use('/countries', countriesRoutes);
app.use('/restaurants', restaurantsRoutes);

// connecting to database and intialzing the server
db.connect()
.then (res => {
    console.log ('database connected successfully');
    return app.listen (process.env.PORT || 5000);
})
.then (res => {
    console.log('server is intialized');
})
.catch (err => {
    console.log(err);
});



// catching errors
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({status, message, data});
});
