const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')

// Throttle login attempts to slow down brute-force / credential stuffing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,        // 15 minutes
  max: 10,                          // 10 attempts per IP per window
  message: { message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// A looser limit on registration to prevent mass account creation.
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,        // 1 hour
  max: 20,                          // 20 new accounts per IP per hour
  message: { message: 'Too many accounts created. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ─── REGISTER ───────────────────────────────────────
router.post('/register', registerLimiter, async (req, res) => {
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
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ─── LOGIN ───────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    // Use the SAME response for "no such email" and "wrong password" so an
    // attacker can't tell which emails are registered (account enumeration).
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
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
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

module.exports = router