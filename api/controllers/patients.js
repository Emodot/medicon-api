const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

exports.get_all_patients = async (req, res, next) => {
    //Implement Redis when you are getting all patient
    let results;
    let isCached = false;
  try {
    //Check if redis is already instantiated before so that the result can be gotten from Redis
    const cachedResult = await redisClient.get('result');
    if (cachedResult) {
      //Set isCached to be true , so that the frontend developer can know that the result is coming from a cache
      isCached = true;
      //JsonParse the result of the cache and pass it to the client 
      results = JSON.parse(cachedResult);
    } else {
      const findPatient = await Patient.find({userid:req.id}).exec();
      if (!findPatient) {
        throw new Error('No Patient Found');
      }
      const count = findPatient.length;
      results = {
        data:{
          data:findPatient,
          count
        }
      }
      // Save this result into cache to allow future request to fetch from Cache
      await redisClient.set('result',JSON.stringify(results),{
        EX:1200, //expiry time should be 20minute,
        NX:true // ensures it only set a key that doesn't already exist in redis
      })
    }
    return res.status(200).json({
      message: "Get Patients Successfully",
      isCached,
      results
    });
  } catch (e) {
    return res.status(500).json({ errorMsg: e.message, errorStatus: 500, error: true });
  }
};

exports.create_patient = async (req, res, next) => {
  try {
    const allowedField = ['first_name','middle_name','last_name','phone','email'];
    const body = req.body;
    const keys = Object.keys(body);
    const isKey = keys.filter(key=>!allowedField.includes(key));
  
    const theAffectedKey = isKey[0];
  
    if ( isKey.length > 0 ) {
        throw new Error(`${theAffectedKey } is not valid, below are the list of Accepted Fields '${allowedField}' `);
    }
  
    const patient = new Patient({
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
    });

    //Save the user creating Patient
    patient.userid = req.id;

    const result = await patient.save();

    res.status(201).json({
      message: "Patient File Created Successfully",
      patient: result,
    });

  } catch(e) {
    return res.status(500).json({ errorMsg: e.message, errorStatus: 500, error: true });
  } 
};

exports.get_single_patient = async (req, res, next) => {
  let isCached = false;
  let results ;
  try {
    const id = req.params.patientId;
    const patient = await Patient.findOne({_id:id,userid:req.id}).exec();
    if (!patient) {
      throw new Error('Patient Not Found')
    }
    //store to redis
    results = {
      message: "Successfully Fetched Patient",
      patient,
    }
    await redisClient.set('single',JSON.stringify(results),{
      EX:1200,
      NX:true
    })
    res.status(200).json({ isCached,results});
  } catch(e){
    return res.status(500).json({ errorMsg: e.message, errorStatus: 500, error: true });
  }

};

exports.update_patient = async(req, res, next) => {
  try {
    const id = req.params.patientId;
    const allowedField = ['first_name','middle_name','last_name','phone','email'];
    const body = req.body;
    const keys = Object.keys(body);
    const isKey = keys.filter(key=>!allowedField.includes(key));
  
    const theAffectedKey = isKey[0];
  
    if ( isKey.length > 0 ) {
        throw new Error(`${theAffectedKey } is not valid, below are the list of Accepted Fields '${allowedField}' `);
    }
    const patient = await Patient.findOneAndUpdate({_id:id,userid:req.id},req.body);
    if (!patient) {
      throw new Error('Record Failed to Update');
    }
    res.status(200).json({
      message: "Successfully Updated Patient",
      patient
    });
  } catch(e){
    return res.status(500).json({ errorMsg: e.message, errorStatus: 500, error: true });
  }  
};

exports.delete_patient = async(req, res, next) => {
  try {
    const id = req.params.patientId;
    const patient = await Patient.findOne({_id:id,userid:req.id});
    if (!patient) {
      throw new Error('Patient Record not found')
    }
    await patient.remove().exec();
    res.status(200).json({
      message: "Successfully Removed Patient",
      patient
    });
  } catch(e){
    return res.status(500).json({ errorMsg: e.message, errorStatus: 500, error: true });
  }
  
};
