import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/TeamPage.css";

const TeamPage = () => {
 const navigate = useNavigate();
 const [user, setUser] = useState(null);
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const sectionRefs = useRef([]);
 // Ref for the footer for animation purposes
 const footerRef = useRef(null); 

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

 // Dummy team data
 const teamData = [
  {
   role: "Admin",
   members: [
    { name: "Alice Johnson", email: "alice@royals.com", function: "Head Admin" },
    { name: "Bob Smith", email: "bob@royals.com", function: "Co-Admin" },
   ],
  },
  {
   role: "Manager",
   members: [
    { name: "Cathy Green", email: "cathy@royals.com", function: "Restaurant Manager" },
    { name: "David Lee", email: "david@royals.com", function: "Assistant Manager" },
   ],
  },
  {
   role: "Staff",
   members: [
    { name: "Eve Brown", email: "eve@royals.com", function: "Chef" },
    { name: "Frank White", email: "frank@royals.com", function: "Waiter" },
    { name: "Grace Black", email: "grace@royals.com", function: "Waiter" },
   ],
  },
  {
   role: "Sweepers",
   members: [
    { name: "Henry Gold", email: "henry@royals.com", function: "Floor Cleaner" },
    { name: "Ivy Silver", email: "ivy@royals.com", function: "Janitor" },
   ],
  },
  {
   role: "Finance",
   members: [
    { name: "Jack King", email: "jack@royals.com", function: "Accountant" },
    { name: "Lily Queen", email: "lily@royals.com", function: "Cashier" },
   ],
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

  // Observe team sections
  sectionRefs.current.forEach((section) => {
   if (section) observer.observe(section);
  });

  // Observe footer
  if (footerRef.current) {
   observer.observe(footerRef.current);
  }

  return () => {
   sectionRefs.current.forEach((section) => {
    if (section) observer.unobserve(section);
   });
   if (footerRef.current) {
    observer.unobserve(footerRef.current);
   }
  };
 }, []);

 return (
  <div className="team-page">
   {/* NAVBAR */}
   <nav className="navbar animate-left">
    <div className="navbar-left">
     <Link to="/home" className="navbar-logo">The Royals</Link>
    </div>
    <div className="navbar-right animate-right">
     <ul className="nav-links">
      <li><Link to="/team">Team</Link></li>
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/aboutus">About Us</Link></li>
     </ul>

     {user && (
      <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
       <span className="user-name">{user.name}</span>
       <div className="menu-bars">&#9776;</div>

       {dropdownOpen && (
        <div className="dropdown-menu animate-box">
         <Link to="/profile">Profile</Link>
         <button onClick={handleLogout}>Logout</button>
        </div>
       )}
      </div>
     )}
    </div>
   </nav>

   {/* TEAM SECTIONS */}
   <div className="team-container">
    {teamData.map((section, index) => (
     <div
      className="team-section"
      key={index}
      ref={(el) => (sectionRefs.current[index] = el)}
     >
      <h2 className="team-role">{section.role}</h2>
      <div className="team-members">
       {section.members.map((member, idx) => (
        <div className="team-card" key={idx}>
         <p><strong>Name:</strong> {member.name}</p>
         <p><strong>Email:</strong> {member.email}</p>
         <p><strong>Function:</strong> {member.function}</p>
        </div>
       ))}
      </div>
     </div>
    ))}
   </div>

   {/* --- FOOTER SECTION (Copied from HomePage) --- */}
   <footer 
    className="main-footer"
    ref={footerRef}
   >
    <div className="footer-content">
     <div className="footer-section about">
      <h3>The Royals</h3>
      <p>Exceptional quality and elegant dining since 2010. We promise a royal experience with every visit.</p>
      <div className="contact-info">
       <span>📞 0319 - 7630***</span>
      </div>
     </div>
     
     <div className="footer-section links">
      <h3>Quick Links</h3>
      <ul>
       <li><Link to="/aboutus">About Us</Link></li>
       <li><Link to="/reservations">Book a Table</Link></li>
       <li><Link to="/careers">Careers</Link></li>
       <li><Link to="/contact">Contact</Link></li>
      </ul>
     </div>
     
     <div className="footer-section socials">
      <h3>Follow Us</h3>
      <div className="social-links">
       <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
       <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
       <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      </div>
    </div>
   </div>
    
    <div className="footer-bottom">
     <p>&copy; {new Date().getFullYear()} The Royals. All rights reserved. | <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link></p>
    </div>
   </footer>
  </div>
 );
};

export default TeamPage;