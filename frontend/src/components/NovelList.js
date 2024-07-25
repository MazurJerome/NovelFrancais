// src/components/NovelList.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/NovelList.css"; // Chemin mis à jour

function NovelList({ novels }) {
  return (
    <div className="novel-list">
      {novels.map((novel) => (
        <div key={novel.id} className="novel">
          <Link to={`/novel/${novel.id}`}>
            <h3>{novel.title}</h3>
          </Link>
          <p>{novel.description}</p>
        </div>
      ))}
    </div>
  );
}

export default NovelList;
