import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChapterPage from "./pages/ChapterPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NovelPage from "./pages/NovelPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import SearchResultsPage from "./pages/SearchResultsPage";
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
            path="/novel/:novelId/chapters/:chapterId"
            element={<ChapterPage />}
          />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
