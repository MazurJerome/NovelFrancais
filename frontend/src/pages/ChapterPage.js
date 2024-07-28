import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChapterNavigation from "../components/ChapterNavigation";
import FontSizeMenu from "../components/FontSizeMenu";
import "../styles/ChapterPage.css";

function ChapterPage() {
  const { novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [novelTitle, setNovelTitle] = useState("");
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
        setNovelTitle(response.data.title);
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

  return (
    <div className="chapter-page">
      <Link to={`/novel/${novelId}`} className="back-to-novel-link">
        &larr; {novelTitle}
      </Link>
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
            <p>
              <strong>{chapter.title}</strong>
            </p>
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
