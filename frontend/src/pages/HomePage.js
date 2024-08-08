import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import GenreMenu from "../components/GenreMenu";
import NovelCard from "../components/NovelCard";
import "../styles/HomePage.css";

function HomePage() {
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/novels")
      .then((response) => {
        setNovels(response.data);
        const allGenres = response.data.reduce((acc, novel) => {
          novel.genres.forEach((genre) => {
            if (!acc.includes(genre)) acc.push(genre);
          });
          return acc;
        }, []);
        setGenres(allGenres.sort());
      })
      .catch((error) => {
        console.error("There was an error fetching the novels!", error);
      });
  }, []);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setShowCompleted(false);
    axios
      .get(`http://localhost:5000/api/novels/genre/${genre}`)
      .then((response) => {
        setNovels(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the novels by genre!",
          error
        );
      });
  };

  const handleShowCompleted = () => {
    setSelectedGenre(null);
    setShowCompleted(true);
    axios
      .get("http://localhost:5000/api/novels/status/Finis")
      .then((response) => {
        setNovels(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the completed novels!",
          error
        );
      });
  };

  const resetFilters = () => {
    setSelectedGenre(null);
    setShowCompleted(false);
    axios
      .get("http://localhost:5000/api/novels")
      .then((response) => {
        setNovels(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the novels!", error);
      });
  };

  const latestNovels = novels
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    beforeChange: (current, next) => setSlideIndex(next),
  };

  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <div className="home-page">
      <div className="home-layout">
        <div className="center-column">
          {!selectedGenre && !showCompleted && (
            <>
              <h3>Derniers romans mis à jour</h3>
              <Slider {...settings}>
                {latestNovels.map((novel, index) => (
                  <div
                    key={novel._id}
                    className={index === slideIndex ? "highlight" : ""}
                  >
                    <NovelCard novel={novel} />
                  </div>
                ))}
              </Slider>
            </>
          )}
          {selectedGenre && (
            <>
              <h3>Romans du genre : {selectedGenre}</h3>
              <div className="novel-list">
                {novels.map((novel) => (
                  <NovelCard key={novel._id} novel={novel} />
                ))}
              </div>
            </>
          )}
          {showCompleted && (
            <>
              <h3>Romans terminés</h3>
              <div className="novel-list">
                {novels.map((novel) => (
                  <NovelCard key={novel._id} novel={novel} />
                ))}
              </div>
            </>
          )}
          {!selectedGenre && !showCompleted && (
            <>
              <h3>Liste complète des romans</h3>
              <div className="novel-list">
                {novels.map((novel) => (
                  <NovelCard key={novel._id} novel={novel} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="right-column">
          <h3>Selection rapide</h3>
          <button
            onClick={handleShowCompleted}
            className="completed-novels-btn"
          >
            Romans terminés
          </button>
          <GenreMenu
            genres={genres}
            onSelectGenre={handleGenreSelect}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
