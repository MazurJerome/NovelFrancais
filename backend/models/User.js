// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", // par défaut, un utilisateur est un visiteur
    enum: ["user", "admin"], // seuls ces rôles sont valides
  },
});

module.exports = mongoose.model("User", UserSchema);
