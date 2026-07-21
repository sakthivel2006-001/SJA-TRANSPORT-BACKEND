require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const exists = await Admin.findOne({
      email: 'admin@sattransport.com',
    });

    if (exists) {
      console.log('Admin already exists');
      process.exit();
    }

    await Admin.create({
      name: 'SAT Admin',
      email: 'admin@sattransport.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin created successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();