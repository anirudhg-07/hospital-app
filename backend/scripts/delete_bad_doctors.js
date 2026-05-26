const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../models/User')
const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')

const BAD_NAMES = ['King', 'Aaka']

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env')
  }

  await mongoose.connect(process.env.MONGO_URI)

  const badUsers = await User.find({ name: { $in: BAD_NAMES }, role: 'doctor' }).select('_id name email')
  if (badUsers.length === 0) {
    console.log('No bad doctor users found. Nothing to delete.')
    await mongoose.disconnect()
    return
  }

  const badUserIds = badUsers.map((u) => u._id)

  const badDoctorProfiles = await Doctor.find({ userId: { $in: badUserIds } }).select('_id userId')
  const badDoctorIds = badDoctorProfiles.map((d) => d._id)

  const apptCount = await Appointment.countDocuments({ doctorId: { $in: badDoctorIds } })

  console.log('About to delete:')
  console.log('- Users:', badUsers.map((u) => u.toObject()))
  console.log('- Doctor profiles:', badDoctorProfiles.map((d) => d.toObject()))
  console.log(`- Appointments referencing these doctors: ${apptCount}`)

  if (apptCount > 0) {
    console.log('Refusing to delete because appointments exist. Delete/migrate appointments first.')
    await mongoose.disconnect()
    process.exit(2)
  }

  const doctorDel = await Doctor.deleteMany({ _id: { $in: badDoctorIds } })
  const userDel = await User.deleteMany({ _id: { $in: badUserIds } })

  console.log('Deleted doctor profiles:', doctorDel.deletedCount)
  console.log('Deleted users:', userDel.deletedCount)

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
