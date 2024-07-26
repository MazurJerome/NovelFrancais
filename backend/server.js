const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Novel = require("./models/Novel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://jeromeMazur:jlRnYpLj66QDItnn@cluster0.3n7x9q9.mongodb.net/datab_Quiz",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware pour vérifier le token
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware pour vérifier le rôle d'administrateur
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Route pour obtenir tous les novels ou filtrer par titre
app.get("/api/novels", async (req, res) => {
  const query = req.query.query;
  let novels;

  try {
    if (query) {
      // Filtre les novels en fonction du titre correspondant à la requête
      novels = await Novel.find({ title: { $regex: query, $options: "i" } });
    } else {
      novels = await Novel.find();
    }
    res.json(novels);
  } catch (err) {
    console.error("Error fetching novels:", err);
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
    res.json(novel);
  } catch (err) {
    console.error("Error fetching novel:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir un chapitre spécifique par novel ID et chapitre index
app.get("/api/novels/:novelId/chapters/:chapterId", async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    const chapter = novel.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    res.json(chapter);
  } catch (err) {
    console.error("Error fetching chapter:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer un novel (réservée aux administrateurs)
app.post("/api/novels", auth, adminAuth, async (req, res) => {
  try {
    const newNovel = new Novel(req.body);
    await newNovel.save();
    res.status(201).json(newNovel);
  } catch (err) {
    console.error("Error adding novel:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour ajouter un chapitre à un novel existant (réservée aux administrateurs)
app.post("/api/novels/:id/chapters", auth, adminAuth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }
    novel.chapters.push(req.body);
    await novel.save();
    res.status(201).json(novel);
  } catch (err) {
    console.error("Error adding chapter:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer un novel (réservée aux administrateurs)
app.delete("/api/novels/:id", auth, adminAuth, async (req, res) => {
  try {
    const novel = await Novel.findByIdAndDelete(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }
    res.json({ message: "Novel deleted" });
  } catch (err) {
    console.error("Error deleting novel:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer un chapitre (réservée aux administrateurs)
app.delete(
  "/api/novels/:novelId/chapters/:chapterId",
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const novel = await Novel.findById(req.params.novelId);
      if (!novel) {
        return res.status(404).json({ message: "Novel not found" });
      }
      const chapter = novel.chapters.id(req.params.chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      novel.chapters.pull(req.params.chapterId);
      await novel.save();
      res.json({ message: "Chapter deleted" });
    } catch (err) {
      console.error("Error deleting chapter:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// Route pour l'inscription
app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ username, email, password, role });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Route pour la connexion
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
