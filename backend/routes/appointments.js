const express = require('express')
const router = express.Router()
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const verifyToken = require('../middleware/auth')

// Helper: ensure the caller is the doctor who owns this Doctor profile.
// appointment.doctorId stores the Doctor profile _id, so we look it up and
// compare its owning userId against the caller's token.
async function assertDoctorOwnership(req, doctorId) {
  const doctor = await Doctor.findById(doctorId)
  if (!doctor) return { ok: false, status: 404, message: 'Doctor not found' }
  if (String(doctor.userId) !== String(req.user.userId)) {
    return { ok: false, status: 403, message: 'Forbidden' }
  }
  return { ok: true, doctor }
}

// Book a new appointment
router.post('/book', verifyToken, async (req, res) => {
  try {
    // The patient is always the logged-in user — never trust an id from the body.
    const patientId = req.user.userId
    const { doctorId, date, timeSlot, reason } = req.body

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
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Get all appointments for a patient
router.get('/patient/:patientId', verifyToken, async (req, res) => {
  try {
    // A patient may only read their own appointments; doctors may read any.
    if (req.user.role === 'patient' &&
        String(req.params.patientId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const appointments = await Appointment.find({
      patientId: req.params.patientId
    }).populate('doctorId', 'name')
    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Get today's appointments for a doctor
router.get('/doctor/:doctorId', verifyToken, async (req, res) => {
  try {
    // Only the doctor who owns this profile can see its patient queue.
    const ownership = await assertDoctorOwnership(req, req.params.doctorId)
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message })
    }

    const today = new Date().toISOString().split('T')[0]
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
      date: today
    }).populate('patientId', 'name')
    .sort({ tokenNumber: 1 })
    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Update appointment status
router.put('/status/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body

    // Reject any status outside the allowed set (findByIdAndUpdate would
    // otherwise skip the schema enum and let garbage values through).
    const allowed = ['waiting', 'in-progress', 'done', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })

    // Only the doctor who owns this appointment may change its status.
    const ownership = await assertDoctorOwnership(req, appointment.doctorId)
    if (!ownership.ok) {
      return res.status(ownership.status).json({ message: ownership.message })
    }

    appointment.status = status
    await appointment.save()
    res.json({ message: 'Status updated!', appointment })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Cancel appointment
router.put('/cancel/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })

    // The owning patient can cancel their own appointment; the owning doctor can too.
    const isOwnerPatient =
      req.user.role === 'patient' &&
      String(appointment.patientId) === String(req.user.userId)

    let allowed = isOwnerPatient
    if (!allowed && req.user.role === 'doctor') {
      const ownership = await assertDoctorOwnership(req, appointment.doctorId)
      allowed = ownership.ok
    }
    if (!allowed) return res.status(403).json({ message: 'Forbidden' })

    appointment.status = 'cancelled'
    await appointment.save()
    res.json({ message: 'Appointment cancelled!', appointment })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

module.exports = router