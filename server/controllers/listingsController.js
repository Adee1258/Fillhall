const { Listing } = require('../models/db');

// GET all active listings (public)
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'active' });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
};

// GET single listing by id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
};

// POST create listing
const createListing = async (req, res) => {
  try {
    const listingData = { ...req.body, createdAt: new Date() };
    if (req.file) listingData.logo = req.file.filename;
    if (!listingData.status) listingData.status = 'active';
    const listing = await Listing.insert(listingData);
    res.status(201).json({ id: listing._id, message: 'Listing created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
};

// PUT update listing
const updateListing = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };
    if (req.file) updateData.logo = req.file.filename;
    const count = await Listing.update({ _id: req.params.id }, { $set: updateData });
    if (count === 0) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
};

// DELETE listing
const deleteListing = async (req, res) => {
  try {
    const count = await Listing.remove({ _id: req.params.id });
    if (count === 0) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
};

// GET dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const total    = await Listing.count({});
    const active   = await Listing.count({ status: 'active' });
    const inactive = await Listing.count({ status: 'inactive' });
    res.json({ total, active, inactive });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// GET all listings (admin)
const getAllListingsAdmin = async (req, res) => {
  try {
    const listings = await Listing.find({});
    // Sort by createdAt descending
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getDashboardStats,
  getAllListingsAdmin
};
