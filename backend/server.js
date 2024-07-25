const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Novel = require("./models/Novel");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://jeromeMazur:jlRnYpLj66QDItnn@cluster0.3n7x9q9.mongodb.net/datab_Quiz", // Spécifiez uniquement la base de données principale
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route pour obtenir tous les novels
app.get("/api/novels", async (req, res) => {
  try {
    const novels = await Novel.find();
    res.json(novels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir un novel par ID avec tous les détails
app.get("/api/novels/:id", async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    console.log("Novel details:", novel); // Ajouter un log pour déboguer les données du novel
    res.json(novel);
  } catch (err) {
    console.error("Error fetching novel:", err); // Ajouter un log pour les erreurs
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/novels/:novelId/chapters/:chapterIndex", async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    const chapter = novel.chapters[req.params.chapterIndex];
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    console.log("Chapter found:", chapter); // Déboguer les données du chapitre
    res.json(chapter);
  } catch (err) {
    console.error("Error:", err); // Déboguer les erreurs
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
