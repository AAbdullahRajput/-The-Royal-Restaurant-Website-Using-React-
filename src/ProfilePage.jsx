import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name);
      setEmail(parsedUser.email);
    } else navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/update-profile",
        { name, email }
      );
      const updatedUser = res.data.user;
      setUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      {/* Background image */}
      <div className="background-image"></div>

      {/* NAVBAR */}
      <nav className="navbar animate-left">
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">The Royals</Link>
        </div>
        <div className="navbar-right animate-right">
          <ul className="nav-links">
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            {user && (
              <li>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* PROFILE BOX */}
      <div className="profile-container animate-box">
        <h2>Profile</h2>
        <div className="profile-card">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />

          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
