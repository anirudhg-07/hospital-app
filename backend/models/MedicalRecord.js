const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, trim: true },
    frequency: { type: String, trim: true },
    duration: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
)

const medicalRecordSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    diagnosis: { type: String, trim: true },
    symptoms: { type: String, trim: true },
    notes: { type: String, trim: true },
    medicines: { type: [medicineSchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema)
