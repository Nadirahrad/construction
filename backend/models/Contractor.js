const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  no: { type: Number, default: null }, 
  name: { type: String, default: "Unknown" },
  ic_passport: { type: String, default: "" },
  gender: { type: String, default: "N/A" },
  position: { type: String, default: "" },
  company: { type: String, default: "" },
  cidb_registration: { type: String, default: "" },
  grade: { type: String, default: "" },
  state: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  renewStatus: { type: String, enum: ["pending", "completed"], default: "pending" }
});

module.exports = mongoose.model("Contractor", contractorSchema);

