const mongoose = require("mongoose");

const ReadNovelSchema = new mongoose.Schema({
  novelId: { type: mongoose.Schema.Types.ObjectId, ref: "Novel" },
  novelTitle: { type: String },
  lastChapterRead: { type: Number },
  coverImage: { type: String }, // Ajouter le champ coverImage
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  readNovels: [ReadNovelSchema],
});

module.exports = mongoose.model("User", UserSchema);
