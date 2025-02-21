const express = require("express");
const router = express.Router();
const Contractor = require("../models/Contractor");

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
router.post("/", async (req, res) => {
  const { name, company, phone, address } = req.body;
  
  if (!name || !company || !phone || !address) {
    return res.status(400).json({ message: "Sila isi semua maklumat." });
  }

  try {
    const newContractor = new Contractor({ name, company, phone, address });
    const savedContractor = await newContractor.save();
    res.status(201).json(savedContractor);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const updatedContractor = await Contractor.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedContractor) {
      return res.status(404).json({ message: "Kontraktor tidak ditemui" });
    }

    res.json(updatedContractor);
  } catch (error) {
    console.error("Ralat pada server:", error);
    res.status(500).json({ message: "Ralat dalaman server" });
  }
});


module.exports = router;
