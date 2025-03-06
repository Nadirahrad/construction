require("dotenv").config(); // <-- Tambah ini untuk baca .env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // <-- Import fungsi connectDB
const Contractor = require("./models/Contractor");
const authRoutes = require("./routes/authRoutes");
const contractorRoutes = require("./routes/contractorRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Sambungkan ke MongoDB
connectDB(); // <-- Panggil fungsi untuk connect database

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/contractors", contractorRoutes);
app.use("/api", contractorRoutes);



app.get("/api/contractors", async (req, res) => {
  try {
    const contractors = await Contractor.find(); // Ambil semua kontraktor dari DB
    console.log("Kontraktor dihantar ke frontend:", contractors); // Debug
    res.json(contractors); // Pastikan data dihantar sebagai JSON
  } catch (error) {
    console.error("Error mengambil kontraktor:", error);
    res.status(500).json({ message: "Gagal mengambil data kontraktor" });
  }
});


app.post('/api/contractors', async (req, res) => {
  console.log("Data diterima dari frontend:", req.body); // Debugging

  try {
    const newContractor = new Contractor(req.body);
    await newContractor.save();
    res.status(201).json(newContractor);
  } catch (error) {
    console.error("Error menyimpan data:", error);
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
});

app.delete("/api/contractors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Menerima permintaan DELETE untuk ID:", id);
    const deletedContractor = await Contractor.findByIdAndDelete(id);
    if (!deletedContractor) {
      return res.status(404).json({ message: "Kontraktor tidak ditemui" });
    }
    res.json({ message: "Kontraktor berjaya dipadam" });
  } catch (error) {
    console.error("Error memadam kontraktor:", error);
    res.status(500).json({ message: "Gagal memadam kontraktor" });
  }
});

app.put("/api/contractors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID yang diterima untuk update:", id); // Debugging

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Semak format ObjectId
      return res.status(400).json({ message: "ID tidak sah" });
    }

    const updatedContractor = await Contractor.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedContractor) {
      return res.status(404).json({ message: "Kontraktor tidak ditemui" });
    }

    res.json(updatedContractor);
  } catch (error) {
    console.error("Error mengemas kini kontraktor:", error);
    res.status(500).json({ message: "Gagal mengemas kini kontraktor" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "user@example.com" && password === "password") {
    return res.json({ success: true, token: "your_token_here" });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.post("/api/auth/google-login", async (req, res) => {
  const { email, uid } = req.body;

  try {
      let user = await User.findOne({ email });

      if (!user) {
          // Kalau user tak ada dalam database, auto signup
          user = new User({ email, googleId: uid });
          await user.save();
      }

      // Generate token untuk authentication
      const token = jwt.sign({ id: user._id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });

      res.status(200).json({ message: "Login successful", token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/contractors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Menerima permintaan GET untuk ID:", id); // Debugging

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Validate ObjectId
      return res.status(400).json({ message: "ID tidak sah" });
    }

    const contractor = await Contractor.findById(id);

    if (!contractor) {
      return res.status(404).json({ message: "Kontraktor tidak ditemui" });
    }

    res.json(contractor);
  } catch (error) {
    console.error("Error mendapatkan kontraktor:", error);
    res.status(500).json({ message: "Gagal mendapatkan kontraktor" });
  }
});

app.put('/api/contractors/:id/renew', async (req, res) => {
  const { id } = req.params;
  const { renewStatus } = req.body;

  try {
    const contractor = await Contractor.findByIdAndUpdate(
      id,
      { renewStatus },
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    res.json(contractor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


