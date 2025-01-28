const express = require('express');
const { authenticate, checkRole } = require('../middleware/authenticate');
const router = express.Router();

// Admin-only route
router.get('/dashboard', authenticate, checkRole('admin'), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
