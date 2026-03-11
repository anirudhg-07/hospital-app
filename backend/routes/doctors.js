const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Doctor = require('../models/Doctor')

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email')
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// Create doctor profile
router.post('/create', async (req, res) => {
  try {
    const { userId, specialization, experience, fees } = req.body
    const doctor = new Doctor({ userId, specialization, experience, fees })
    await doctor.save()
    res.status(201).json({ message: 'Doctor profile created!', doctor })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
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
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

module.exports = router