const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NovelSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  chapters: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
});

// Utilisez la collection 'Novels.novels' dans la base de données 'datab_Quiz'
const Novel = mongoose.model("Novel", NovelSchema, "Novels.novels");
module.exports = Novel;
