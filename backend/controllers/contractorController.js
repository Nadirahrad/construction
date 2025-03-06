const Contractor = require('../models/Contractor');
const xlsx = require("xlsx");

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

exports.importExcel = async (req, res) => {
  try { // Ambil semua fail
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Tiada fail dihantar!" });
    }

    let allData = [];

    req.files.forEach((file) => {
      console.log(`Processing file: ${file.originalname}`);
      // Tambah logik untuk parse Excel atau CSV

    // Baca fail Excel dari buffer
    const workbook = xlsx.read(file.buffer, { type: "buffer" });

    // Ambil sheet pertama
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert data kepada JSON
    const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    console.log("Data dari Excel:", data); // Debugging
    allData = allData.concat(data); // Gabungkan data dari semua fail
    });

    // Simpan data dalam MongoDB
    const contractorsToSave = allData.map(item => ({
      no: item["NO"] || null,
  name: item["NAMA"] || "Unknown",
  ic_passport: item["NO IC/PASSPORT"] || "",
  gender: item["JANTINA"] || "N/A",
  position: item["JAWATAN"] || "",
  company: item["NAMA SYARIKAT"] || "",
  cidb_registration: item["NO. PENDAFTARAN CIDB"] || "",
  grade: item["GRED"] || "",
  state: item["NEGERI"] || "",
  email: item["EMAIL"] || "",
  phone: item["NO.TELEFON"] || ""
}));

    // Masukkan ke database secara bulk insert
    await Contractor.insertMany(contractorsToSave);

    res.json({ message: "Data berjaya diimport!", savedCount: contractorsToSave.length });
  } catch (error) {
    console.error("Error processing file:", error.message, error.stack);
res.status(500).json({ message: "Error processing file", error: error.message });
  }
};
