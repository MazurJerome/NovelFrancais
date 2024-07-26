import React from "react";
import "../styles/FontSizeMenu.css";

const FontSizeMenu = ({ fontSize, setFontSize }) => {
  const handleIncrease = () => {
    setFontSize((prevSize) => Math.min(prevSize + 1, 36)); // Limite max 36px
  };

  const handleDecrease = () => {
    setFontSize((prevSize) => Math.max(prevSize - 1, 12)); // Limite min 12px
  };

  return (
    <div className="font-size-menu">
      <p>Taille de la police</p>
      <div className="font-size-control">
        <button onClick={handleDecrease}>-</button>
        <span>{fontSize}px</span>
        <button onClick={handleIncrease}>+</button>
      </div>
    </div>
  );
};

export default FontSizeMenu;
