const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: '*' // Allow all origins to prevent any Vercel domain issues
}))
app.use(express.json())

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