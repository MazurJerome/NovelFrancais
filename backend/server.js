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

// Route pour obtenir un novel par ID
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

// Route pour obtenir un chapitre spécifique par novel ID et numéro de chapitre
app.get("/api/novels/:novelId/chapters/:chapterNumber", async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    const chapter = novel.chapters.find(
      (chap) => chap.number === parseInt(req.params.chapterNumber)
    );
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    res.json(chapter);
  } catch (err) {
    console.error("Error fetching chapter:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour récupérer le profil de l'utilisateur avec les chapitres lus
app.get("/api/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        readNovels: user.readNovels || [], // Inclure readNovels dans la réponse
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour l'inscription
app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).send("Server error");
  }
});

// Route pour la connexion
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(
    "Received login request with email:",
    email,
    "and password:",
    password
  );

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email); // Ajout du log
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user with email:", email); // Ajout du log
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error("Server error:", err.message); // Ajout du log
    res.status(500).send("Server error");
  }
});

// Route pour marquer un chapitre comme lu et mettre à jour les informations de lecture de l'utilisateur
app.post(
  "/api/novels/:novelId/chapters/:chapterNumber/mark-as-read",
  auth,
  async (req, res) => {
    try {
      const { novelId, chapterNumber } = req.params;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const novel = await Novel.findById(novelId);
      if (!novel) {
        return res.status(404).json({ message: "Novel not found" });
      }

      const chapter = novel.chapters.find(
        (chap) => chap.number === parseInt(chapterNumber)
      );
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      const readNovelIndex = user.readNovels.findIndex(
        (rn) => rn.novelId.toString() === novelId
      );

      if (readNovelIndex > -1) {
        if (user.readNovels[readNovelIndex].lastChapterRead < chapter.number) {
          user.readNovels[readNovelIndex].lastChapterRead = chapter.number;
        }
      } else {
        user.readNovels.push({
          novelId: novel._id,
          novelTitle: novel.title,
          lastChapterRead: chapter.number,
          coverImage: novel.coverImage, // Ajouter coverImage ici
        });
      }

      await user.save();
      res.json({ message: "Chapter marked as read" });
    } catch (err) {
      console.error("Error marking chapter as read:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Ajout de la route pour supprimer un roman de la liste de lecture d'un utilisateur
app.delete("/api/profile/novels/:novelId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { novelId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.readNovels = user.readNovels.filter(
      (novel) => novel.novelId.toString() !== novelId
    );

    await user.save();
    res.json({ message: "Novel removed from reading list" });
  } catch (err) {
    console.error("Error removing novel from reading list:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
