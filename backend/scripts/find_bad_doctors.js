const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../models/User')
const Doctor = require('../models/Doctor')

const BAD_NAMES = ['King', 'Aaka', 'Unknown']

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env')
  }

  await mongoose.connect(process.env.MONGO_URI)

  const users = await User.find({ name: { $in: BAD_NAMES } }).select('name email role')
  console.log('Users matched:', users.map((u) => u.toObject()))

  const docs = await Doctor.find({})
    .populate('userId', 'name email role')

  const bad = docs.filter((d) => BAD_NAMES.includes(d.userId?.name))
  console.log(
    'Doctor profiles matched:',
    bad.map((d) => ({
      doctorId: String(d._id),
      userId: String(d.userId?._id),
      name: d.userId?.name,
      email: d.userId?.email,
      role: d.userId?.role,
    }))
  )

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
