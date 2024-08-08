import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAuthActive, setIsAuthActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1); // Nouvel état pour la suggestion survolée
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      navigate(`/novel/${suggestion._id}`);
      setSearchQuery("");
      setSuggestions([]);
      setIsSearchActive(false);
    },
    [navigate]
  );

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/novels?query=${searchQuery}`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        setHoveredIndex(-1); // Réinitialiser l'index survolé lorsque la flèche bas est utilisée
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        setHoveredIndex(-1); // Réinitialiser l'index survolé lorsque la flèche haut est utilisée
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, suggestions, handleSuggestionClick]);

  useEffect(() => {
    setIsSearchActive(false);
    setIsAuthActive(false);
    setSearchQuery("");
    setSuggestions([]);
  }, [location]);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
      setIsSearchActive(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
    setIsAuthActive(false);
    if (!isSearchActive) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    } else {
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const toggleAuth = () => {
    setIsAuthActive((prev) => !prev);
    setIsSearchActive(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-section">
        <Link to="/" onClick={handleHomeClick} aria-label="Accueil">
          Accueil
        </Link>
      </div>
      <div className="navbar-section middle-section">
        <h1>Bienvenue sur le site NovelFrancais</h1>
      </div>
      <div className="navbar-section right-section">
        <div className="search-section">
          <form
            onSubmit={handleSearch}
            className={isSearchActive ? "active" : ""}
          >
            <button
              type="button"
              className="search-toggle-btn"
              onClick={toggleSearch}
              aria-label="Toggle Search"
            >
              <i
                className={`fa ${isSearchActive ? "fa-minus" : "fa-search"}`}
              ></i>
            </button>
            <input
              ref={searchInputRef}
              type="text"
              className={`search-input ${isSearchActive ? "active" : ""}`}
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Input"
            />
            {isSearchActive && (
              <button
                type="submit"
                className="search-submit-btn search-icon"
                aria-label="Submit Search"
              >
                <i className="fa fa-arrow-right"></i>
              </button>
            )}
          </form>
          {suggestions.length > 0 && (
            <div className="suggestions-container">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion._id}
                  className={`suggestion-item ${
                    index === selectedIndex && hoveredIndex === -1
                      ? "selected"
                      : ""
                  } ${index === hoveredIndex ? "hovered" : ""}`}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  aria-label={suggestion.title}
                >
                  {suggestion.title}
                </div>
              ))}
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <div className="profile-section">
            <button
              type="button"
              className="auth-toggle-btn"
              onClick={toggleAuth}
              aria-label="Toggle Profile Menu"
            >
              <i className={`fa ${isAuthActive ? "fa-minus" : "fa-user"}`}></i>
            </button>
            {isAuthActive && (
              <div className="auth-buttons">
                <Link to="/profile" className="auth-link" aria-label="Profile">
                  Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="auth-link"
                  aria-label="Logout"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link" aria-label="Login">
              Connexion
            </Link>
            <Link to="/register" className="auth-link" aria-label="Register">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
