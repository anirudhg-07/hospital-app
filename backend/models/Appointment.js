const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  timeSlot: {
    type: String,
    required: true
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