import axios from "axios";
import React, { useEffect, useState } from "react";
import NovelCard from "../components/NovelCard";
import "../styles/HomePage.css";

function HomePage() {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/novels")
      .then((response) => setNovels(response.data))
      .catch((error) => console.error("Error fetching novels:", error));
  }, []);

  return (
    <div className="home-page">
      <h2>Liste des Novels</h2>
      <div className="novels-container">
        {novels.map((novel) => (
          <div key={novel._id} className="novel-card-container">
            <NovelCard novel={novel} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
