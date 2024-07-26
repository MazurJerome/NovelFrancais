import axios from "axios";
import React, { useState } from "react";
import "../styles/AddNovelPage.css";

function AddNovelPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [alternativeName, setAlternativeName] = useState("");
  const [genre, setGenre] = useState("");
  const [source, setSource] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("En cours");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNovel = {
      title,
      author,
      alternativeName,
      genre,
      source,
      coverImage,
      description,
      status,
      chapters: [],
    };

    try {
      await axios.post("http://localhost:5000/api/novels", newNovel);
      alert("Roman ajouté avec succès!");
      // Réinitialiser le formulaire après la soumission
      setTitle("");
      setAuthor("");
      setAlternativeName("");
      setGenre("");
      setSource("");
      setCoverImage("");
      setDescription("");
      setStatus("En cours");
    } catch (error) {
      console.error("Erreur lors de l'ajout du roman:", error);
      alert("Une erreur est survenue lors de l'ajout du roman.");
    }
  };

  return (
    <div className="add-novel-page">
      <h2>Ajouter un roman</h2>
      <form onSubmit={handleSubmit} className="add-novel-form">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Auteur"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Nom alternatif"
          value={alternativeName}
          onChange={(e) => setAlternativeName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image de couverture (URL)"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="En cours">En cours</option>
          <option value="Fini">Fini</option>
        </select>

        <button type="submit">Ajouter le roman</button>
      </form>
    </div>
  );
}

export default AddNovelPage;
