const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Behind Render's proxy — trust it so rate limiting sees the real client IP.
app.set('trust proxy', 1)

// Restrict cross-origin access to our own frontends instead of allowing every
// site on the internet. Extra origins can be added via CORS_ORIGINS (CSV).
const allowedOrigins = [
  'http://localhost:3000',
  'https://hospital-app-snowy.vercel.app',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : []),
]
app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / server-to-server requests (no Origin header) and any
    // Vercel preview deployment of this project.
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json())

// Strip MongoDB operator keys ($gt, $ne, ...) and dotted keys from incoming
// data so user input can't be turned into a query operator (NoSQL injection).
app.use((req, _res, next) => {
  const scrub = (obj) => {
    if (!obj || typeof obj !== 'object') return
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key]
      } else {
        scrub(obj[key])
      }
    }
  }
  scrub(req.body)
  scrub(req.query)
  scrub(req.params)
  next()
})

// Routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const doctorRoutes = require('./routes/doctors')
const appointmentRoutes = require('./routes/appointments')
const recordRoutes = require('./routes/records')

app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/records', recordRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('DB Error:', err))

app.get('/', (req, res) => {
  res.send('Hospital App Backend is Running!')
})

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server running on port 8000`)
})