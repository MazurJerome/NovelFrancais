import React from "react";
import { Link } from "react-router-dom";
import "../styles/NovelCard.css";

function NovelCard({ novel }) {
  return (
    <div className="novel-card">
      <Link to={`/novel/${novel._id}`} className="novel-card-link">
        <div
          className="novel-card-image"
          style={{ backgroundImage: `url(${novel.coverImage})` }}
        ></div>
        <div className="novel-card-content">
          <h3>{novel.title}</h3>
        </div>
      </Link>
    </div>
  );
}

export default NovelCard;
