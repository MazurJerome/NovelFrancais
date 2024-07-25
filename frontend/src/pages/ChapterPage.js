import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChapterPage.css";

function ChapterPage() {
  const { novelId, chapterIndex } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/novels/${novelId}/chapters/${chapterIndex}`
      )
      .then((response) => {
        console.log("Chapter data:", response.data); // Ajouter un log pour déboguer
        setChapter(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chapter:", error); // Ajouter un log pour les erreurs
        setError("Error fetching chapter");
        setLoading(false);
      });
  }, [novelId, chapterIndex]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!chapter) {
    return <div>No chapter found</div>;
  }

  return (
    <div className="chapter-page">
      <h2>{chapter.title}</h2>
      <p>{chapter.content}</p>
    </div>
  );
}

export default ChapterPage;
