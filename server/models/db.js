const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  business_name:      { type: String, required: true },
  category:           { type: String, required: true },
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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected ✓');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

module.exports = { Listing, initDatabase };
