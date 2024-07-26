import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NovelCard from "../components/NovelCard";
import "../styles/SearchResultsPage.css";

function SearchResultsPage() {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      axios
        .get(`http://localhost:5000/api/novels?query=${query}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the search results!",
            error
          );
        });
    }
  }, [location.search]);

  return (
    <div className="search-results-page">
      <h2>
        Résultats de recherche pour "
        {new URLSearchParams(location.search).get("query")}"
      </h2>
      <div className="results-grid">
        {results.map((novel) => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;
