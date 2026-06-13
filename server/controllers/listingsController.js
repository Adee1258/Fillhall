const { Listing } = require('../models/db');

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
};

const createListing = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle base64 image from body (logo_base64 field)
    if (req.body.logo_base64) {
      data.logo = req.body.logo_base64;
      delete data.logo_base64;
    }

    if (!data.status) data.status = 'active';
    const listing = new Listing(data);
    await listing.save();
    res.status(201).json({ id: listing._id, message: 'Listing created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle base64 image from body
    if (req.body.logo_base64) {
      data.logo = req.body.logo_base64;
      delete data.logo_base64;
    }

    const listing = await Listing.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const total    = await Listing.countDocuments();
    const active   = await Listing.countDocuments({ status: 'active' });
    const inactive = await Listing.countDocuments({ status: 'inactive' });
    res.json({ total, active, inactive });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

const getAllListingsAdmin = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
};

module.exports = {
  getAllListings, getListingById, createListing,
  updateListing, deleteListing, getDashboardStats, getAllListingsAdmin
};
