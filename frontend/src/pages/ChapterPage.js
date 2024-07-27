import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChapterPage.css";

function ChapterPage() {
  const { novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/novels/${novelId}/chapters/${chapterId}`)
      .then((response) => {
        setChapter(response.data);
        markChapterAsRead();
      })
      .catch((error) => {
        console.error("Error fetching chapter:", error);
      });
  }, [novelId, chapterId]);

  const markChapterAsRead = () => {
    axios
      .post(
        `http://localhost:5000/api/novels/${novelId}/chapters/${chapterId}/mark-as-read`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      )
      .then((response) => {
        console.log("Chapter marked as read");
      })
      .catch((error) => {
        console.error("Error marking chapter as read:", error);
      });
  };

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chapter-page">
      <h2>{chapter.title}</h2>
      <p>{chapter.content}</p>
    </div>
  );
}

export default ChapterPage;
