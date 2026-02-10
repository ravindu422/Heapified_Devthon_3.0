import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ContactAvailability from './models/ContactAvailability.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safelanka');
    console.log('✅ Connected to MongoDB');

    // Check users collection
    const users = await User.find({});
    console.log(`\n📋 Users collection: ${users.length} documents`);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.fullName} (${user.email}) - Role: ${user.role}`);
      console.log(`     Location: ${user.location || 'Not specified'}`);
      console.log(`     Skills: ${Object.keys(user.skills || {}).filter(skill => user.skills[skill]).join(', ') || 'None'}`);
    });

    // Check contact availability collection
    const contacts = await ContactAvailability.find({});
    console.log(`\n📞 Contact Availability collection: ${contacts.length} documents`);
    contacts.forEach((contact, index) => {
      console.log(`  ${index + 1}. User ID: ${contact.userId}`);
      console.log(`     Availability: ${contact.availability.date?.toISOString().split('T')[0]} at ${contact.availability.time?.hour}:${contact.availability.time?.minute} ${contact.availability.time?.period}`);
      console.log(`     Emergency Contact: ${contact.emergencyContact.name} (${contact.emergencyContact.relationship}) - ${contact.emergencyContact.phone}`);
    });

    if (users.length === 0 && contacts.length === 0) {
      console.log('\n⚠️  No data found. Please complete the registration form first.');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

checkDatabase();
