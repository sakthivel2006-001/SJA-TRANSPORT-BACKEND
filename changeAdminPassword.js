require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function changePassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Change to MONGO_URI if that's what your .env uses

        const admin = await Admin.findOne({
            email: 'admin@sattransport.com'
        });

        if (!admin) {
            console.log('Admin not found');
            process.exit();
        }

        // Change the password here
        admin.password = 'Admin@2026';

        await admin.save();

        console.log('✅ Password updated successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

changePassword();