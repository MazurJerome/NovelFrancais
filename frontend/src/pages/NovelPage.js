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

  const markChapterAsRead = (chapterId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post(
        `http://localhost:5000/api/novels/${id}/chapters/${chapterId}/mark-as-read`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      )
      .then((response) => {
        console.log("Chapter marked as read:", response.data);
      })
      .catch((error) => {
        console.error("Error marking chapter as read:", error);
      });
  };

  const handleChapterClick = (chapterId) => {
    markChapterAsRead(chapterId);
    navigate(`/novel/${id}/chapters/${chapterId}`);
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
                  : `${novel.description.substring(0, 475)}...`}
                {!isDescriptionExpanded && novel.description.length > 475 && (
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
                <strong>Genre:</strong> {novel.genre.join(", ")}
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
                      onClick={() => handleChapterClick(chapter._id)}
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
