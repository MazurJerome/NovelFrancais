import React from "react";
import { Link } from "react-router-dom";
import "../styles/ChapterNavigation.css";

const ChapterNavigation = ({ novelId, chapterId, chapters, onChange }) => {
  const chapterIndex = chapters.findIndex((chap) => chap._id === chapterId);

  return (
    <div className="chapter-navigation">
      <Link
        to={
          chapterIndex > 0
            ? `/novel/${novelId}/chapters/${chapters[chapterIndex - 1]._id}`
            : "#"
        }
        className={`nav-link ${chapterIndex <= 0 ? "disabled" : ""}`}
        onClick={(e) => {
          if (chapterIndex <= 0) e.preventDefault();
        }}
      >
        &lt; Chapitre précédent
      </Link>
      <select
        value={chapterIndex}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        {chapters.map((chap, i) => (
          <option key={chap._id} value={i}>
            Chapitre {i + 1}
          </option>
        ))}
      </select>
      <Link
        to={
          chapterIndex < chapters.length - 1
            ? `/novel/${novelId}/chapters/${chapters[chapterIndex + 1]._id}`
            : "#"
        }
        className={`nav-link ${
          chapterIndex >= chapters.length - 1 ? "disabled" : ""
        }`}
        onClick={(e) => {
          if (chapterIndex >= chapters.length - 1) e.preventDefault();
        }}
      >
        Chapitre suivant &gt;
      </Link>
    </div>
  );
};

export default ChapterNavigation;
