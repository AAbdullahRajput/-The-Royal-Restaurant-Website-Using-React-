import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/AboutUsPage.css"; 

const AboutUsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sectionRefs = useRef([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Content data structured for the card layout
  const aboutUsData = [
    {
      role: "Our Mission",
      content:
        "To provide exceptional service and culinary experiences that delight our customers and exceed their expectations every day. This includes focusing on quality ingredients and a welcoming atmosphere.",
    },
    {
      role: "Our Vision",
      content:
        "To be the leading name in our industry, recognized for quality, innovation, and unwavering commitment to customer satisfaction across all our locations.",
    },
    {
      role: "Our Values",
      content:
        "Integrity, Excellence, Customer Focus, and Teamwork are the pillars of everything we do, guiding our decisions and interactions.",
    },
    {
      role: "History",
      content:
        "Founded in 2010, The Royals has grown from a small family venture into a beloved local landmark, expanding our offerings and reach through dedication and hard work.",
    },
    {
      role: "Privacy Policy",
      content:
        "We are committed to protecting your privacy. Our policy details how we collect, use, and protect your personal data.",
    },
    {
      role: "Contact Us",
      content:
        "Reach out to us at contact@theroyals.com or call us at (555) 123-4567. We are always here to help with any inquiries or feedback!",
    },
    {
      role: "Careers",
      content:
        "Join our dynamic team! We are looking for passionate individuals to grow with us. Visit our careers portal for current openings and opportunities.",
    },
  ];

  // Scroll animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="aboutus-page">
      {/* NAVBAR (Identical to TeamPage) */}
      {/* <nav className="navbar">
        <Link to="/" className="navbar-logo">
          The Royals
        </Link>
        <div className="navbar-right">
          <ul className="nav-links">
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
          </ul>
          {user && (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <div className="menu-bars" onClick={() => setDropdownOpen(!dropdownOpen)}>
                ☰
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav> */}

      {/* ABOUT US SECTIONS */}
      <div className="aboutus-container">
        
        {/* ⭐ ADDED: Back to Home Button ⭐ */}
        <div className="back-to-home-container">
          <Link to="/home" className="back-to-home-button">
            ← Back to Home
          </Link>
        </div>
        {/* ⭐ END ADDED ⭐ */}

        {aboutUsData.map((section, index) => (
          <div
            className="aboutus-section"
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
          >
            <h2 className="section-role">{section.role}</h2>
            <div className="section-content-wrapper">
              <div className="section-card">
                <p>{section.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="aboutus-footer">
        Made by FYP AAI &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default AboutUsPage;