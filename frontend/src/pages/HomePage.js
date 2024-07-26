import axios from "axios";
import React, { useEffect, useState } from "react";
import NovelCard from "../components/NovelCard";
import "../styles/HomePage.css";

function HomePage() {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/novels")
      .then((response) => {
        setNovels(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the novels!", error);
      });
  }, []);

  return (
    <div className="home-page">
      <h2>Liste des romans</h2>
      <div className="novel-list">
        {novels.map((novel) => (
          <NovelCard key={novel._id} novel={novel} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
