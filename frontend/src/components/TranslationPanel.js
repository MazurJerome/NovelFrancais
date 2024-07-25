// src/components/TranslationPanel.js
import axios from "axios";
import React, { useState } from "react";

function TranslationPanel({ novelId }) {
  const [translation, setTranslation] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = () => {
    axios
      .post(`/api/novels/${novelId}/translate`, { text: translation })
      .then((response) => {
        setTranslatedText(response.data.translatedText);
      })
      .catch((error) => {
        console.error("There was an error translating the text!", error);
      });
  };

  return (
    <div className="translation-panel">
      <textarea
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        placeholder="Enter text to translate"
      ></textarea>
      <button onClick={handleTranslate}>Translate</button>
      {translatedText && (
        <div className="translated-text">
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TranslationPanel;
