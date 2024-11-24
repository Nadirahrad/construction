const mongoose = require('mongoose');

/*const contractorSchema = new mongoose.Schema({
   name: String,
   company: String,
   contact: String,
   licenseExpiry: Date,
});*/

// Define contractor schema
const contractorSchema = new mongoose.Schema({
   name: { type: String, required: true },
   company: { type: String, required: true },
   contact: { type: String, required: true },
   licenseExpiry: { type: Date, required: true },
});

// Export the Contractor model
module.exports = mongoose.model('Contractor', contractorSchema);
