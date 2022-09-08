const compression = require('compression')
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Explaining Some terms
// Morgan is used for logging http errors
//Compression compress the body of every request therefore optimizing the code and reduce latency
//When you get this code , delete your node modules and do npm install
// Install redix on your system to so that redis cache can work effectively
//If you have any question feel free to contact me

app.use(compression());
const patientRoutes = require('./api/routes/patients');
const appointmentRoutes = require('./api/routes/appointments');
const userRoutes = require('./api/routes/user');


mongoose.connect(`mongodb+srv://medicon-api:${process.env.MONGO_ATLAS_PW}@medicon-api.sb6d2hl.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

mongoose.Promise = global.Promise;

// setup the logger
app.use(morgan('tiny'));
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
  return res.send('its working');
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