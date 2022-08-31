const mongoose = require('mongoose')
const Appointment = require('../models/appointment');
const Patient = require('../models/patient');

exports.get_all_appointments = (req, res, next) => {
  Appointment.find()
    .populate('patient')
    .exec()
    .then(docs => {
      const data = {
        count: docs.length,
        appointment: docs
      }
      console.log(docs)
      res.status(200).json({
        message: 'All Appointments Gotten',
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

exports.create_appointments = (req, res, next) => {
  Patient.findById(req.body.patientId)
    .then(patient => {
      if (!patient) {
        return res.status(404).json({
          message: 'Patient not found'
        })
      }
      const appointment = new Appointment({
        _id: new mongoose.Types.ObjectId(),
        reason: req.body.reason,
        date: req.body.date,
        time: req.body.time,
        doctor: req.body.doctor,
        patient: req.body.patientId
      });
      return appointment.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Appointment Created',
        appointment: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}

exports.get_single_appointment = (req, res, next) => {
  const id = req.params.appointmentId;
  Appointment.findById(id)
    .populate('patient')
    .exec()
    .then(doc => {
      console.log(doc)
      if (doc) {
        res.status(200).json({
          message: 'Appointment Gotten',
          appointment: doc
        })
      } else {
        res.status(404).json({
          message: 'No Appointment Found'
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

exports.update_single_appointment = (req, res, next) => {
  const id = req.params.appointmentId
  res.status(200).json({
    message: 'Updated Appointment!',
    id: id
  })
}

exports.delete_single_appointment = (req, res, next) => {
  const id = req.params.appointmentId
  Appointment.remove({_id: id})
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Appointment Deleted!',
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