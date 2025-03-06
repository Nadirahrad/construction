const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check kalau user dah ada
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already registered" });

    // Hash password sebelum simpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error); // Debugging
    res.status(500).json({ message: error.message });
  }
});


// JWT Secret Key
const JWT_SECRET = "your_secret_key"; // 🔴 Ganti dengan key sebenar di .env

// 🟢 LOGIN DENGAN EMAIL & PASSWORD
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User tidak dibenarkan." });
    }

    // Semak password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Kata laluan salah." });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login berjaya", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 LOGIN DENGAN GOOGLE
router.post("/google-login", async (req, res) => {
  const { email, googleId } = req.body;

  try {
    // Cari user berdasarkan email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User tidak dibenarkan." });
    }

    // Semak jika user ada googleId yang sah
    if (!user.googleId) {
      return res.status(401).json({ message: "User tidak daftar dengan Google." });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login berjaya", token });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user by email
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // ID dari token

    await User.findByIdAndDelete(userId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user dalam database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
