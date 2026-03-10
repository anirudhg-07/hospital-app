const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('DB Error:', err))

app.get('/', (req, res) => {
  res.send('Hospital App Backend is Running!')
})

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server running on port 5000`)
})