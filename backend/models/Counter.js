const mongoose = require('mongoose')

// One document per (doctor, day) holding the last token number issued.
// Incrementing seq atomically guarantees unique, monotonic tokens with no
// race conditions and no reuse after cancellations.
const counterSchema = new mongoose.Schema({
  key: {
    type: String,        // `${doctorId}_${date}`
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('Counter', counterSchema)
