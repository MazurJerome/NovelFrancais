const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: String,
  link: String,
  content: String,
});

const novelSchema = new mongoose.Schema({
  title: String,
  author: String,
  alternativeName: String,
  genre: [String], // Modifier ici pour accepter un tableau de chaînes
  source: String,
  status: String,
  coverImage: String,
  description: String,
  chapters: [chapterSchema],
});

module.exports = mongoose.model("Novel", novelSchema);
