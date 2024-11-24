// routes/contractorRoutes.js
const express = require('express');
const Contractor = require('../models/Contractor');
const { authenticate } = require('../middleware/authenticate'); // Make sure you have an authentication middleware if necessary

const router = express.Router();

// Create a contractor
router.post('/', authenticate, async (req, res) => {
    try {
        const contractor = new Contractor(req.body);
        await contractor.save();
        res.status(201).send(contractor);
    } catch (err) {
        res.status(400).send({ error: 'Invalid contractor data', details: err.message });
    }
});

// Get all contractors
router.get('/', authenticate, async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.send(contractors);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update contractor by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
        res.send(contractor);
    } catch (err) {
        res.status(400).send({ error: 'Failed to update contractor', details: err.message });
    }
});

// Delete contractor by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndDelete(req.params.id);
        if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
        res.send({ message: 'Contractor deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete contractor', details: err.message });
    }
});

module.exports = router;
