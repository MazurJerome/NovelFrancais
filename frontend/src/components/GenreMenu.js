import React from "react";
import "../styles/GenreMenu.css";

function GenreMenu({ genres, onSelectGenre, resetFilters }) {
  // Trier les genres par ordre alphabétique
  const sortedGenres = genres.sort((a, b) => a.localeCompare(b));

  return (
    <div className="genre-menu">
      <h3>Genres</h3>
      <ul>
        {sortedGenres.map((genre) => (
          <li key={genre} onClick={() => onSelectGenre(genre)}>
            {genre}
          </li>
        ))}
      </ul>
      <button onClick={resetFilters} className="reset-filter-btn">
        Réinitialiser le filtre
      </button>
    </div>
  );
}

export default GenreMenu;
