import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChapterNavigation from "../components/ChapterNavigation";
import FontSizeMenu from "../components/FontSizeMenu";
import "../styles/ChapterPage.css";

function ChapterPage() {
  const { novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/novels/${novelId}/chapters/${chapterId}`)
      .then((response) => {
        setChapter(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the chapter!", error);
      });

    axios
      .get(`http://localhost:5000/api/novels/${novelId}`)
      .then((response) => {
        setChapters(response.data.chapters);
      })
      .catch((error) => {
        console.error("There was an error fetching the chapters!", error);
      });
  }, [novelId, chapterId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  const handleChapterChange = (newIndex) => {
    navigate(`/novel/${novelId}/chapters/${chapters[newIndex]._id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const chapterIndex = chapters.findIndex((chap) => chap._id === chapterId);
      if (event.key === "ArrowLeft" && chapterIndex > 0) {
        navigate(
          `/novel/${novelId}/chapters/${chapters[chapterIndex - 1]._id}`
        );
      } else if (
        event.key === "ArrowRight" &&
        chapterIndex < chapters.length - 1
      ) {
        navigate(
          `/novel/${novelId}/chapters/${chapters[chapterIndex + 1]._id}`
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [chapterId, chapters, navigate, novelId]);

  return (
    <div className="chapter-page">
      {chapter ? (
        <>
          <h2>{chapter.title}</h2>
          <ChapterNavigation
            novelId={novelId}
            chapterId={chapterId}
            chapters={chapters}
            onChange={handleChapterChange}
          />
          <FontSizeMenu fontSize={fontSize} setFontSize={setFontSize} />
          <div
            className="chapter-content"
            style={{ fontSize: `${fontSize}px` }}
          >
            <p>{chapter.content}</p>
          </div>
          <ChapterNavigation
            novelId={novelId}
            chapterId={chapterId}
            chapters={chapters}
            onChange={handleChapterChange}
          />
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default ChapterPage;
