import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/NovelPage.css";

function NovelPage() {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/novels/${id}`)
      .then((response) => {
        setNovel(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the novel!", error);
      });
  }, [id]);

  const handleChapterClick = (chapterNumber) => {
    navigate(`/novel/${id}/chapters/${chapterNumber}`);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className="novel-page">
      {novel ? (
        <>
          <h2>{novel.title}</h2>
          <div className="novel-details">
            <div className="novel-cover">
              <img src={novel.coverImage} alt={novel.title} />
            </div>
            <div
              className={`novel-description ${
                isDescriptionExpanded ? "expanded" : ""
              }`}
            >
              <p>
                {isDescriptionExpanded
                  ? novel.description
                  : `${novel.description.substring(0, 700)}...`}
                {!isDescriptionExpanded && novel.description.length > 700 && (
                  <span
                    className="toggle-description"
                    onClick={toggleDescription}
                  >
                    lire la suite...
                  </span>
                )}
              </p>
              {isDescriptionExpanded && (
                <span
                  className="toggle-description"
                  onClick={toggleDescription}
                >
                  &lt;&lt;&lt;
                </span>
              )}
            </div>
          </div>
          <div className="novel-info-chapters">
            <div className="novel-info">
              <h3>Informations</h3>
              <p>
                <strong>Auteur:</strong> {novel.author}
              </p>
              <p>
                <strong>Nom alternatif:</strong> {novel.alternativeName}
              </p>
              <p>
                <strong>Genre:</strong>{" "}
                {Array.isArray(novel.genres)
                  ? novel.genres.join(", ")
                  : "Non spécifié"}
              </p>
              <p>
                <strong>Source:</strong> {novel.source}
              </p>
              <p>
                <strong>Statut:</strong> {novel.status}
              </p>
            </div>
            <div className="novel-chapters">
              <h3>Chapitres</h3>
              <ul>
                {novel.chapters.map((chapter, index) => (
                  <li key={index} className="chapter-item">
                    <button
                      className="chapter-link"
                      onClick={() => handleChapterClick(chapter.number)}
                    >
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default NovelPage;
