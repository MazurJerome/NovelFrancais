// src/components/NovelCard.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/NovelCard.css";

function NovelCard({ novel }) {
  return (
    <Link to={`/novel/${novel._id}`} className="novel-card-link">
      <div className="novel-card">
        <h3>{novel.title}</h3>
        <p>{novel.description}</p>
      </div>
    </Link>
  );
}

export default NovelCard;
