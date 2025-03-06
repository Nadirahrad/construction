const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hanya untuk login manual
  googleId: { type: String }, // Hanya untuk login Google
});

module.exports = mongoose.model("User", UserSchema);


