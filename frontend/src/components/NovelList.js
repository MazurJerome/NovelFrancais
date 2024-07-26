import React from "react";
import { Link } from "react-router-dom";
import "../styles/NovelList.css";

function NovelList({ novels }) {
  return (
    <div className="novel-list">
      {novels.map((novel) => (
        <Link to={`/novel/${novel._id}`} key={novel._id} className="novel-card">
          <div
            className="novel-card-background"
            style={{ backgroundImage: `url(${novel.coverImage})` }}
          >
            <div className="novel-card-content">
              <h3>{novel.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default NovelList;
