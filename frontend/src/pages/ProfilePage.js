import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <button onClick={handleLogout} className="logout-btn">
        Déconnexion
      </button>
    </div>
  );
}

export default ProfilePage;
