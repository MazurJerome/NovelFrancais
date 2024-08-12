// ChapterNavigation.js
import React, { useEffect } from "react";
import "../styles/ChapterNavigation.css";

const ChapterNavigation = ({ novelId, chapterId, chapters, onChange }) => {
  const currentIndex = chapters.findIndex(
    (chapter) => chapter.number === parseInt(chapterId, 10)
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        onChange(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < chapters.length - 1) {
        onChange(currentIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, chapters, onChange]);

  return (
    <div className="chapter-navigation">
      <button
        onClick={() => currentIndex > 0 && onChange(currentIndex - 1)}
        disabled={currentIndex === 0}
      >
        <i className="fas fa-arrow-left"></i> Chapitre précédent
      </button>
      <select
        value={chapterId}
        onChange={(e) =>
          onChange(
            chapters.findIndex(
              (chapter) => chapter.number === parseInt(e.target.value, 10)
            )
          )
        }
      >
        {chapters.map((chapter, index) => (
          <option key={chapter.number} value={chapter.number}>
            {chapter.title}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          currentIndex < chapters.length - 1 && onChange(currentIndex + 1)
        }
        disabled={currentIndex === chapters.length - 1}
      >
        Chapitre suivant <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default ChapterNavigation;
