const Contractor = require('../models/Contractor');

// Create contractor
exports.addContractor = async (req, res) => {
  try {
    const { name, phone, email, company } = req.body;
    const contractor = new Contractor({ name, phone, email, company });
    await contractor.save();
    res.status(201).json({ message: 'Contractor added successfully', contractor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding contractor', error: error.message });
  }
};

// Get all contractors
exports.getContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contractors', error: error.message });
  }
};
