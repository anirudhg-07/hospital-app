const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../models/User')
const Doctor = require('../models/Doctor')

const BAD_NAMES = ['King', 'Aaka']

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing in backend/.env')

  await mongoose.connect(process.env.MONGO_URI)

  const badUsers = await User.find({ name: { $in: BAD_NAMES }, role: 'doctor' }).select('_id name email role')
  if (badUsers.length === 0) {
    console.log('No bad doctor users found.')
    await mongoose.disconnect()
    return
  }

  const badUserIds = badUsers.map((u) => u._id)
  const updateRes = await Doctor.updateMany(
    { userId: { $in: badUserIds } },
    { $set: { hidden: true } }
  )

  console.log('Marked hidden=true for doctor profiles:', updateRes.modifiedCount)
  console.log('Users left untouched (keeps appointment history referential integrity).')

  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
