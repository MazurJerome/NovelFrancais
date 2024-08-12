import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [novelUpdates, setNovelUpdates] = useState({});
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/profile", {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        const readNovels = response.data.user.readNovels;
        const uniqueNovels = [];

        readNovels.forEach((novel) => {
          const existingNovelIndex = uniqueNovels.findIndex(
            (n) => n.novelId === novel.novelId
          );

          if (existingNovelIndex === -1) {
            uniqueNovels.push(novel);
          } else if (
            uniqueNovels[existingNovelIndex].lastChapterRead <
            novel.lastChapterRead
          ) {
            uniqueNovels[existingNovelIndex] = novel;
          }
        });

        response.data.user.readNovels = uniqueNovels;
        setProfile(response.data);

        uniqueNovels.forEach((novel) => {
          axios
            .get(`http://localhost:5000/api/novels/${novel.novelId}`)
            .then((novelResponse) => {
              setNovelUpdates((prevUpdates) => ({
                ...prevUpdates,
                [novel.novelId]: novelResponse.data.chapters.length,
              }));
            })
            .catch((error) => {
              console.error(
                `Error fetching novel ${novel.novelId} details:`,
                error
              );
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setIsTokenValid(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleDeleteNovel = (novelId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/profile/novels/${novelId}`, {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          user: {
            ...prevProfile.user,
            readNovels: prevProfile.user.readNovels.filter(
              (novel) => novel.novelId !== novelId
            ),
          },
        }));
      })
      .catch((error) => {
        console.error("Error deleting novel:", error);
      });
  };

  if (!isTokenValid) {
    return (
      <div className="profile-page">
        <div className="emoji">😢</div>
        <h2>Session Expirée</h2>
        <p>Votre session a expiré. Veuillez vous reconnecter.</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          Reconnectez-vous
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Profil de {profile.user.username}</h2>
      <p>Email: {profile.user.email}</p>
      <h3>Romans lus</h3>
      <div className="novel-list">
        {profile.user.readNovels.map((novel) => (
          <div
            key={`${novel.novelId}-${novel.lastChapterRead}`}
            className="novel-card"
          >
            <Link
              to={`/novel/${novel.novelId}/chapters/${novel.lastChapterRead}`}
              className="novel-card-link"
            >
              <div
                className="novel-card-image"
                style={{ backgroundImage: `url(${novel.coverImage || ""})` }}
              ></div>
              <div className="novel-card-content">
                <p className="chap-read">Chapitre {novel.lastChapterRead}</p>
                <h3>{novel.novelTitle}</h3>
                {novelUpdates[novel.novelId] &&
                  novelUpdates[novel.novelId] > novel.lastChapterRead && (
                    <p className="new-chapter-available">
                      Nouveau chapitre disponible!
                    </p>
                  )}
              </div>
            </Link>
            <button
              onClick={() => handleDeleteNovel(novel.novelId)}
              className="delete-novel-btn"
            >
              Supprimer de la liste de lecture
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Déconnexion
      </button>
    </div>
  );
}

export default ProfilePage;
