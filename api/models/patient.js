const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  middle_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Patient', patientSchema)