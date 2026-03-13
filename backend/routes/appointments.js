const express = require('express')
const router = express.Router()
const Appointment = require('../models/Appointment')
const verifyToken = require('../middleware/auth')

// Book a new appointment
router.post('/book', verifyToken, async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot, reason } = req.body

    // check if slot is already taken
    const existingAppointment = await Appointment.findOne({
      doctorId, date, timeSlot,
      status: { $ne: 'cancelled' }
    })
    if (existingAppointment) {
      return res.status(400).json({ message: 'This slot is already booked' })
    }

    // generate token number for that day
    const appointmentsToday = await Appointment.countDocuments({
      doctorId, date,
      status: { $ne: 'cancelled' }
    })
    const tokenNumber = appointmentsToday + 1

    // create appointment
    const appointment = new Appointment({
      patientId, doctorId, date,
      timeSlot, tokenNumber, reason
    })
    await appointment.save()

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment,
      tokenNumber
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Get all appointments for a patient
router.get('/patient/:patientId', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId
    }).populate('doctorId', 'name')
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Get today's appointments for a doctor
router.get('/doctor/:doctorId', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
      date: today
    }).populate('patientId', 'name')
    .sort({ tokenNumber: 1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Update appointment status
router.put('/status/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.json({ message: 'Status updated!', appointment })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Cancel appointment
router.put('/cancel/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
    res.json({ message: 'Appointment cancelled!', appointment })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

module.exports = router