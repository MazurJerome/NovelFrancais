import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddChapterPage from "./pages/AddChapterPage";
import AddNovelPage from "./pages/AddNovelPage";
import HomePage from "./pages/HomePage";
import NovelPage from "./pages/NovelPage";
import SearchResultsPage from "./pages/SearchResultsPage"; // Ajoutez cette ligne
import "./styles/App.css"; // Assurez-vous que App.css est importé

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/novel/:id" element={<NovelPage />} />
          <Route path="/add-novel" element={<AddNovelPage />} />
          <Route path="/novel/:id/add-chapter" element={<AddChapterPage />} />
          <Route path="/search" element={<SearchResultsPage />} />{" "}
          {/* Ajoutez cette ligne */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
