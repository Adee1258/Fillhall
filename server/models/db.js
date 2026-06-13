const mongoose = require('mongoose');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const listingSchema = new mongoose.Schema({
  business_name:      { type: String, required: true },
  category:           { type: String, default: 'venue' },
  location:           String,
  guest_capacity:     Number,
  guest_capacity_min: Number,
  guest_capacity_max: Number,
  budget:             String,
  description:        String,
  whatsapp_number:    { type: String, required: true },
  logo:               String,
  status:             { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

// Cache connection across serverless invocations
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      family: 4,
      maxPoolSize: 5,
      bufferCommands: false
    });
    isConnected = true;
    console.log('MongoDB connected ✓');
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

// Called at startup (non-blocking)
const initDatabase = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB init error:', err.message);
  }
};

module.exports = { Listing, initDatabase, connectDB };
