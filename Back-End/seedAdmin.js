import mongoose from 'mongoose';
import { connectToDB } from './database/db.js';
import { config } from './config/config.js';
import { User } from './schema/Users/authSchema.js';
import { hashPassword } from './utils/index.js';

const seedAdmin = async () => {
  try {
    await connectToDB();
    console.log('Connected to DB');

    const email = 'kobiowuq@gmail.com';
    const password = 'Samzik234!';
    const name = 'seed';

    // Check if exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      isApproved: true
    });

    await newAdmin.save();
    console.log(`Admin user created successfully! Login with: ${email} / ${password}`);
    console.log('User has isApproved=true for admin access.');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
