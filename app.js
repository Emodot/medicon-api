const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const patientRoutes = require('./api/routes/patients');
const appointmentRoutes = require('./api/routes/appointments');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  "mongodb+srv://medicon-api:" + process.env.MONGO_ATLAS_PW + "@medicon-api.sb6d2hl.mongodb.net/?retryWrites=true&w=majority"
)

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
  }
  next();
})

app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/user', userRoutes);

app.get('', (req,res) => {
  res.send('its working');
})

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;