const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  reason: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  doctor: { type: String, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema)