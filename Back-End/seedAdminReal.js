import mongoose from 'mongoose';
import { connectToDB } from './database/db.js';
import { config } from './config/config.js';
import Admin from './schema/Admin/authSchema.js';
import { hashPassword } from './utils/index.js';

const seedRealAdmin = async () => {
  try {
    await connectToDB();
    console.log('Connected to DB');

    const email = 'kobiowuq@gmail.com';
    const password = 'Samzik234!';

    // Check Admin collection
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = new Admin({
      email,
      password: hashedPassword
    });

    await newAdmin.save();
    console.log(`✅ Admin created! Login: ${email} / ${password}`);
    console.log('Use Admin Login page (separate from User login)');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedRealAdmin();
