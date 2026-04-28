import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB for seeding');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      { name: 'Admin User', email: 'admin@lms.com', password, role: 'Admin' },
      { name: 'Sales Executive', email: 'sales@lms.com', password, role: 'Sales' },
      { name: 'Sanction Officer', email: 'sanction@lms.com', password, role: 'Sanction' },
      { name: 'Disbursement Manager', email: 'disburse@lms.com', password, role: 'Disbursement' },
      { name: 'Collection Agent', email: 'collect@lms.com', password, role: 'Collection' },
      { name: 'Test Borrower', email: 'borrower@lms.com', password, role: 'Borrower' },
    ];

    await User.insertMany(users);
    console.log('Seed successful! Created 6 users with password: password123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
