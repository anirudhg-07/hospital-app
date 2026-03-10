const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ─── REGISTER ───────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // scramble the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // save new user to database
    const user = new User({ name, email, password: hashedPassword, role })
    await user.save()

    res.status(201).json({ message: 'Account created successfully!' })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// ─── LOGIN ───────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Email not found' })
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' })
    }

    // create a JWT token (digital ID card)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

module.exports = router