const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },  // <-- company diperlukan
  email: { type: String, required: true },    // <-- email diperlukan
  phone: { type: String },
  address: { type: String }
});

module.exports = mongoose.model("Contractor", contractorSchema);

