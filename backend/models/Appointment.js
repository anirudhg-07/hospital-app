const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  // Online patients have a User account; walk-ins do not (info is stored inline).
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // For walk-ins (no account): patient details captured by the receptionist.
  patientName: {
    type: String,
    default: ''
  },
  patientPhone: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['online', 'walk-in'],
    default: 'online'
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  // Walk-ins don't reserve a slot, so this is optional.
  timeSlot: {
    type: String,
    default: 'Walk-in'
  },
  tokenNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'done', 'cancelled'],
    default: 'waiting'
  },
  reason: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema)