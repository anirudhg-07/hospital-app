const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Doctor = require('./models/Doctor');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, finding doctor accounts...");
    const doctors = await User.find({ role: 'doctor' });
    
    let createdCount = 0;
    for (let user of doctors) {
      const profile = await Doctor.findOne({ userId: user._id });
      if (!profile) {
          await Doctor.create({
              userId: user._id,
              specialization: 'Cardiology',
              experience: '5 years',
              fees: 500
          });
          console.log(`Created missing profile for: ${user.name}`);
          createdCount++;
      } else {
          console.log(`Profile already exists for: ${user.name}`);
      }
    }
    console.log(`Finished! Created ${createdCount} profiles.`);
    process.exit(0);
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
