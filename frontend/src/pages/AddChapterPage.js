import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddChapterPage.css";

function AddChapterPage() {
  const { id } = useParams();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newChapter = {
      title: chapterTitle,
      content: chapterContent,
    };
    axios
      .post(`http://localhost:5000/api/novels/${id}/chapters`, newChapter)
      .then((response) => {
        navigate(`/novel/${id}`);
      })
      .catch((error) => {
        console.error("There was an error adding the chapter!", error);
      });
  };

  return (
    <div className="add-chapter-page">
      <h2>Ajouter un Chapitre</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="chapterTitle">Titre du Chapitre</label>
          <input
            type="text"
            id="chapterTitle"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="chapterContent">Contenu du Chapitre</label>
          <textarea
            id="chapterContent"
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Ajouter Chapitre</button>
      </form>
    </div>
  );
}

export default AddChapterPage;
