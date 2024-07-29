const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  number: { type: Number, required: true },
});

const NovelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  alternativeName: { type: String }, // Ajoutez cette ligne
  genres: [{ type: String }],
  description: { type: String },
  coverImage: { type: String },
  source: { type: String },
  status: { type: String },
  chapters: [ChapterSchema],
});

module.exports = mongoose.model("Novel", NovelSchema);
