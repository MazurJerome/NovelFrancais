import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
      setIsSearchActive(false); // Replie la barre de recherche après la recherche
    }
  };

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-section">
        <Link to="/">Accueil</Link>
        <Link to="/add-novel" className="add-novel-btn">
          Ajouter un roman
        </Link>
      </div>
      <div className="navbar-section middle-section">
        <h1>Bienvenue sur la Bibliothèque</h1>
      </div>
      <div className="navbar-section">
        <div className="search-section">
          <form
            onSubmit={handleSearch}
            className={isSearchActive ? "active" : ""}
          >
            <button
              type="button"
              className="search-toggle-btn"
              onClick={toggleSearch}
            >
              <i
                className={`fa ${isSearchActive ? "fa-minus" : "fa-search"}`}
              ></i>
            </button>
            <input
              type="text"
              className={`search-input ${isSearchActive ? "active" : ""}`}
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearchActive && (
              <button type="submit" className="search-submit-btn">
                <i className="fa fa-arrow-right"></i>
              </button>
            )}
          </form>
        </div>
        <Link to="/login" className="login-btn">
          Connexion
        </Link>
        <Link to="/register" className="register-btn">
          Inscription
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
