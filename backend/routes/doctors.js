const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Doctor = require('../models/Doctor')
const verifyToken = require('../middleware/auth')

// Get all doctors
router.get('/', async (req, res) => {
  try {
  const doctors = await Doctor.find({ hidden: { $ne: true } }).populate('userId', 'name email')
    res.json(doctors)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Create doctor profile (doctor-only; profile is tied to the logged-in user)
router.post('/create', verifyToken, async (req, res) => {
  try {
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create a doctor profile' })
    }

    // Derive owner from the token, not the request body, so a profile
    // can only ever be attached to the caller's own account.
    const userId = req.user.userId

    const existing = await Doctor.findOne({ userId })
    if (existing) {
      return res.status(400).json({ message: 'Doctor profile already exists' })
    }

    const { specialization, experience, fees } = req.body
    const doctor = new Doctor({ userId, specialization, experience, fees })
    await doctor.save()
    res.status(201).json({ message: 'Doctor profile created!', doctor })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Get doctor profile by userId (used by Doctor Dashboard on login)
router.get('/by-user/:userId', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId })
      .populate('userId', 'name email')
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' })
    res.json(doctor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// Get single doctor by id
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email')
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doctor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

module.exports = router