const express = require("express");
const Contractor = require("../models/Contractor");
const multer = require("multer");
const contractorController = require('../controllers/contractorController');

const router = express.Router();

// Setting Multer untuk upload file dalam buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API untuk upload fail Excel
router.post("/import-excel", upload.array("files"), contractorController.importExcel);

// GET semua kontraktor
router.get("/", async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.json(contractors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST tambah kontraktor baru
router.post("/contractors", async (req, res) => {
  try {
    const { name, company, phone, address, email } = req.body;

    const newContractor = new Contractor({
      name: name || "", 
      company: company || "", 
      phone: phone || "", 
      address: address || "", 
      email: email || ""     // ✅ Jika kosong, simpan sebagai string kosong
    });

    await newContractor.save();
    res.status(201).json(newContractor);
  } catch (error) {
    console.error("Error saving contractor:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE contractor by ID
router.delete("/contractors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Menerima permintaan DELETE untuk ID: ${id}`);

    const deletedContractor = await Contractor.findByIdAndDelete(id);

    if (!deletedContractor) {
      return res.status(404).json({ message: "Kontraktor tidak ditemui" });
    }

    res.json({ message: "Kontraktor berjaya dipadam" });
  } catch (error) {
    console.error("Ralat pada server:", error);
    res.status(500).json({ message: "Ralat dalaman server" });
  }
});

// UPDATE contractor by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, phone, email, ic_passport, gender, position, cidb_registration, grade, state } = req.body;

    const existingContractor = await Contractor.findById(id);
    if (!existingContractor) {
      return res.status(404).json({ message: "Kontraktor tidak ditemui" });
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (company !== undefined) updatedData.company = company;
    if (phone !== undefined) updatedData.phone = phone;
    if (email !== undefined) updatedData.email = email;
    if (ic_passport !== undefined) updatedData.ic_passport = ic_passport;
    if (gender !== undefined) updatedData.gender = gender;
    if (position !== undefined) updatedData.position = position;
    if (cidb_registration !== undefined) updatedData.cidb_registration = cidb_registration;
    if (grade !== undefined) updatedData.grade = grade;
    if (state !== undefined) updatedData.state = state;

    const updatedContractor = await Contractor.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(updatedContractor);
  } catch (error) {
    console.error("Ralat pada server:", error);
    res.status(500).json({ message: "Ralat dalaman server" });
  }
});

// DELETE multiple contractors by IDs
router.post("/contractors/delete-multiple", async (req, res) => {
  try {
    const { ids } = req.body; // Terima array of IDs

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    await Contractor.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Contractors successfully deleted" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update renewStatus
// Route untuk update renewStatus
router.put("/contractors/:id/renew", async (req, res) => {
  console.log("PUT request received at /contractors/:id/renew"); // Debugging
  try {
    const { renewStatus } = req.body;
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { renewStatus },
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    res.json(contractor);
  } catch (error) {
    console.error("Error updating contractor:", error); // Debugging
    res.status(500).json({ message: "Error updating renew status", error });
  }
});



module.exports = router;
