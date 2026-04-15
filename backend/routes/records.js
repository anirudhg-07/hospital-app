const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const MedicalRecord = require('../models/MedicalRecord')

// Helper: ensure caller is the doctor linked to this Doctor._id
async function assertDoctorOwnership(req, doctorId) {
  const doctor = await Doctor.findById(doctorId)
  if (!doctor) return { ok: false, status: 404, message: 'Doctor not found' }
  if (String(doctor.userId) !== String(req.user.userId)) {
    return { ok: false, status: 403, message: 'Forbidden' }
  }
  return { ok: true, doctor }
}

// Create or update record for an appointment (doctor-only)
router.post('/appointment/:appointmentId', verifyToken, async (req, res) => {
  try {
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create/update records' })
    }

    const { appointmentId } = req.params
    const appt = await Appointment.findById(appointmentId)
    if (!appt) return res.status(404).json({ message: 'Appointment not found' })

    const ownership = await assertDoctorOwnership(req, appt.doctorId)
    if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message })

    const { diagnosis, symptoms, notes, medicines } = req.body

    const update = {
      appointmentId: appt._id,
      patientId: appt.patientId,
      doctorId: appt.doctorId,
      diagnosis: diagnosis ?? '',
      symptoms: symptoms ?? '',
      notes: notes ?? '',
      medicines: Array.isArray(medicines) ? medicines : [],
    }

    const record = await MedicalRecord.findOneAndUpdate(
      { appointmentId: appt._id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate('patientId', 'name email')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('appointmentId')

    res.status(201).json(record)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Get record by appointmentId (patient can access own appt; doctor can access their appt)
router.get('/appointment/:appointmentId', verifyToken, async (req, res) => {
  try {
    const { appointmentId } = req.params
    const appt = await Appointment.findById(appointmentId)
    if (!appt) return res.status(404).json({ message: 'Appointment not found' })

    if (req.user?.role === 'patient') {
      if (String(appt.patientId) !== String(req.user.userId)) {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.user?.role === 'doctor') {
      const ownership = await assertDoctorOwnership(req, appt.doctorId)
      if (!ownership.ok) return res.status(ownership.status).json({ message: ownership.message })
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const record = await MedicalRecord.findOne({ appointmentId: appt._id })
      .populate('patientId', 'name email')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('appointmentId')

    if (!record) return res.status(404).json({ message: 'Record not found' })
    res.json(record)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// List records for a patient (patient-only, own records)
router.get('/patient/:patientId', verifyToken, async (req, res) => {
  try {
    const { patientId } = req.params

    // Allow if patient is requesting their own records, or if user is a doctor
    if (
      (req.user?.role === 'patient' && String(patientId) !== String(req.user.userId))
      || (req.user?.role !== 'patient' && req.user?.role !== 'doctor')
    ) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const records = await MedicalRecord.find({ patientId })
      .sort({ createdAt: -1 })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('appointmentId')

    res.json(records)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

module.exports = router
