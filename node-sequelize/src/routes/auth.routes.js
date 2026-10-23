const express = require('express');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Authenticated route (Any logged-in user)
router.get('/profile', verifyToken, getProfile);

// Admin-only route
router.get('/admin/dashboard', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
});

// Captain-only route
router.get('/captain/orders', verifyToken, authorizeRoles('captain'), (req, res) => {
  res.status(200).json({ message: 'Active orders for Captain access' });
});

// Customer-only route
router.get('/customer/orders', verifyToken, authorizeRoles('customer'), (req, res) => {
  res.status(200).json({ message: 'Customer order history' });
});

// Multi-role route (Both Admin and Captain)
router.get('/fleet/status', verifyToken, authorizeRoles('admin', 'captain'), (req, res) => {
  res.status(200).json({ message: 'Fleet status data accessible by Admin and Captain' });
});

module.exports = router;