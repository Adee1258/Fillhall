const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 first — fixes DNS SRV timeout on many Pakistani ISPs
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

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('MongoDB connected ✓');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Server will continue running — DB features may not work until connection is established.');
  }
};

module.exports = { Listing, initDatabase };
