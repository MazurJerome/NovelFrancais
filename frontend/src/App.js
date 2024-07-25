import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChapterPage from "./pages/ChapterPage";
import HomePage from "./pages/HomePage";
import NovelPage from "./pages/NovelPage";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/novel/:id" element={<NovelPage />} />
          <Route
            path="/novel/:novelId/chapters/:chapterIndex"
            element={<ChapterPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
