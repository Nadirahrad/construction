const express = require('express');
const Contractor = require('../models/Contractor');
const { authenticate, checkRole } = require('../middleware/authenticate'); // Middleware untuk autentikasi dan peranan

const router = express.Router();

// Cipta kontraktor (Admin sahaja)
router.post('/', authenticate, checkRole('admin'), async (req, res) => {
    try {
        const contractor = new Contractor(req.body);
        await contractor.save();
        res.status(201).send(contractor);
    } catch (err) {
        res.status(400).send({ error: 'Invalid contractor data', details: err.message });
    }
});

// Dapatkan semua kontraktor (Semua pengguna yang telah login)
router.get('/', authenticate, async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.send(contractors);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Kemas kini kontraktor berdasarkan ID (Admin sahaja)
router.put('/:id', authenticate, checkRole('admin'), async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
        res.send(contractor);
    } catch (err) {
        res.status(400).send({ error: 'Failed to update contractor', details: err.message });
    }
});

// Padam kontraktor berdasarkan ID (Admin sahaja)
router.delete('/:id', authenticate, checkRole('admin'), async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndDelete(req.params.id);
        if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
        res.send({ message: 'Contractor deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete contractor', details: err.message });
    }
});

module.exports = router;

