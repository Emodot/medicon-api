const mongoose = require('mongoose')
const Appointment = require('../models/appointment');
const Patient = require('../models/patient');

exports.get_all_patients = (req, res, next) => {
  Patient.find()
    .exec()
    .then(docs => {
      const data = {
        count: docs.length,
        patients: docs
      }
      console.log(docs)
      res.status(200).json({
        message: 'Get Patients Successfully',
        data
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

exports.create_patient = (req, res, next) => {
  const patient = new Patient({
    _id: new mongoose.Types.ObjectId(),
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email
  })
  patient
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Patient File Created Successfully',
        patient: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

exports.get_single_patient = (req, res, next) => {
  const id = req.params.patientId;
  Patient.findById(id)
    .exec()
    .then(doc => {
      console.log(doc)
      if (doc) {
        res.status(200).json({
          message: 'Single Patient Gotten',
          doc
        })
      } else {
        res.status(404).json({
          message: 'No Patient Found'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}

exports.update_patient = (req, res, next) => {
  const id = req.params.patientId
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Patient.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Patient data Updated!',
        result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}

exports.delete_patient = (req, res, next) => {
  const id = req.params.patientId
  Patient.remove({_id: id})
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Patient Deleted!',
        result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}