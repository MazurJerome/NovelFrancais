import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function NovelPage() {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/novels/${id}`)
      .then((response) => {
        console.log("Novel data:", response.data); // Log pour déboguer
        setNovel(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching novel:", error); // Log pour déboguer les erreurs
        setError("Error fetching novel");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!novel) {
    return <div>No novel found</div>;
  }

  return (
    <div className="novel-page">
      <h2>{novel.title}</h2>
      <p>{novel.description}</p>
      <p>Status: {novel.status}</p>
      <h3>Chapters</h3>
      <ul>
        {novel.chapters.map((chapter, index) => (
          <li key={index}>
            <Link to={`/novel/${novel._id}/chapters/${index}`}>
              {chapter.title}
            </Link>
            <p>{chapter.content}</p>{" "}
            {/* Affiche le contenu du chapitre pour débogage */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NovelPage;
