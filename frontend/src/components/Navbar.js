// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-section">
        <Link to="/">Home</Link>
      </div>
      <div className="navbar-section">
        <h1>Bienvenue sur notre site de traduction de novels</h1>
      </div>
      <div className="navbar-section">
        <form className="search-bar">
          <input
            type="search"
            placeholder="Rechercher des novels..."
            required
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
