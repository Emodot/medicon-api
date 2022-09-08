const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  middle_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  userid: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Patient", patientSchema);
