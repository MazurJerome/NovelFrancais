import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/profile", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Profil de {profile.user.username}</h2>
      <p>Email: {profile.user.email}</p>
      <h3>Romans lus</h3>
      {profile.lastChaptersRead.length > 0 ? (
        <ul>
          {profile.lastChaptersRead.map((novel) => (
            <li key={novel.title}>
              <strong>{novel.title}</strong>: Chapitre{" "}
              {novel.lastChapter.number} - {novel.lastChapter.title} -{" "}
              <Link
                to={`/novel/${novel.lastChapter.novelId}/chapters/${novel.lastChapter._id}`}
              >
                Reprendre la lecture
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun roman lu récemment</p>
      )}
      <button onClick={handleLogout} className="logout-btn">
        Déconnexion
      </button>
    </div>
  );
}

export default ProfilePage;
