const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  availableSlots: {
    type: [String],
    default: ['9:00 AM', '10:00 AM', '11:00 AM', 
              '12:00 PM', '2:00 PM', '3:00 PM', 
              '4:00 PM', '5:00 PM']
  }
}, { timestamps: true })

module.exports = mongoose.model('Doctor', doctorSchema)