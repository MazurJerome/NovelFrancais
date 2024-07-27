const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  number: { type: Number, required: true },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const NovelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: [{ type: String }],
  description: { type: String },
  chapters: [ChapterSchema],
});

module.exports = mongoose.model("Novel", NovelSchema);
