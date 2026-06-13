const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getDashboardStats,
  getAllListingsAdmin
} = require('../controllers/listingsController');

router.get('/', getAllListings);
router.get('/admin', authenticateToken, getAllListingsAdmin);
router.get('/stats', authenticateToken, getDashboardStats);
router.get('/:id', getListingById);
router.post('/', authenticateToken, createListing);
router.put('/:id', authenticateToken, updateListing);
router.delete('/:id', authenticateToken, deleteListing);

module.exports = router;
