import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Ref to hold all elements we want to observe for scroll animation
  const observerRefs = useRef([]);

  // Data for the Food Menu section (EXPANDED)
  const menuItems = [
    {
      id: 1,
      name: "Signature Premium Steak",
      price: "$45.00",
      description: "Aged Wagyu sirloin, pan-seared to perfection with truffle mash and seasonal asparagus.",
      suggestion: "Our Chef's Top Pick! Pair with a Cabernet Sauvignon.",
      // UPDATED LINK: Steak and sides
img: "https://images.unsplash.com/photo-1709433420444-0535a5f616b9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
    {
      id: 2,
      name: "Spicy Tuna Sushi Bowl",
      price: "$28.00",
      description: "Fresh Ahi tuna, avocado, spicy mayo, and toasted sesame on a bed of seasoned rice.",
      suggestion: "Light & Refreshing. Excellent choice for lunch.",
      // UPDATED LINK: Sushi Bowl
      img: "https://plus.unsplash.com/premium_photo-1726768924288-9e39b9aee11e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
    {
      id: 3,
      name: "Handcrafted Chocolate Lava Cake",
      price: "$14.00",
      description: "Rich dark chocolate cake with a molten center, served with vanilla bean ice cream.",
      suggestion: "Perfect Finish. A truly decadent dessert.",
      // UPDATED LINK: Lava Cake
      img: "https://plus.unsplash.com/premium_photo-1726761672810-a03732995cb1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      name: "Royal Lobster Bisque",
      price: "$18.00",
      description: "Creamy bisque infused with brandy, chunks of fresh lobster meat, and chives.",
      suggestion: "Warm & Luxurious. Ideal appetizer.",
      // UPDATED LINK: Lobster Bisque
      img: "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80"    },
    {
      id: 5,
      name: "Prosciutto Arugula Pizza",
      price: "$22.00",
      description: "Thin-crust pizza with fig jam, fresh mozzarella, prosciutto, and a heap of fresh arugula.",
      suggestion: "Italian Classic. Great for sharing.",
      // UPDATED LINK: Prosciutto Pizza
      img: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?auto=format&fit=crop&w=800&q=80"    },
    {
      id: 6,
      name: "Artisan Cheeseboard",
      price: "$32.00",
      description: "Selection of imported cheeses, honeycomb, nuts, and house-made fruit preserves.",
      suggestion: "Elegant Starter. Pair with a bottle of white wine.",
      // UPDATED LINK: Cheeseboard
      img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80"    },
    {
      id: 7,
      name: "Seared Scallops with Saffron Risotto",
      price: "$38.00",
      description: "Large sea scallops seared in butter, served on creamy saffron-infused Arborio risotto.",
      suggestion: "Light, yet Rich. A customer favorite.",
      // UPDATED LINK: Scallops
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"    },
    {
      id: 8,
      name: "Vegan Mushroom Wellington",
      price: "$26.00",
      description: "Portobello mushrooms, spinach, and herbs baked in flaky puff pastry.",
      suggestion: "Vegetarian Excellence. Highly satisfying.",
      // UPDATED LINK: Mushroom Wellington
      img: "https://images.unsplash.com/photo-1617237692625-36ecc1173a4d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 9,
      name: "Espresso Martini",
      price: "$15.00",
      description: "Freshly brewed espresso, vodka, and coffee liqueur, chilled and served up.",
      suggestion: "Post-Dinner Kick. Perfect substitute for coffee.",
      // UPDATED LINK: Espresso Martini
      img: "https://plus.unsplash.com/premium_photo-1669807973305-df034e751b97?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  // Data for the Reviews section
  const reviews = [
    { rating: 5, text: "Absolutely stunning ambiance and the steak was unparalleled! A true five-star experience." },
    { rating: 4, text: "Great service, though the wait was a bit long. The sushi bowl made up for it—incredibly fresh!" },
    { rating: 5, text: "Best dessert in town. The staff was attentive and the decor is beautiful." },
  ];

  // --- Authentication Logic ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // --- Scroll Animation Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible"); 
          }
        });
      },
      { 
        threshold: 0.2, 
        rootMargin: "0px 0px -100px 0px"
      }
    );

    observerRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observerRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  // --- End Scroll Animation Logic ---


  return (
    <div className="homepage">
      {/* NAVBAR (Fixed at top) */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">The Royals</Link>
        </div>

        <div className="navbar-right">
          <ul className="nav-links">
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
          </ul>

          {user && (
            <div
              className="user-menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="user-name">{user.name}</span>
              <div className="menu-bars">&#9776;</div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION (New Working Image) */}
      <div className="hero-section">
        <img
          // NEW UPDATED LINK for Hero Section
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80" 
          className="hero-img"
          alt="A beautifully plated dish with fresh ingredients"
        />
        <div className="overlay"></div>
        <div 
            className="hero-text scroll-slide-left" 
            ref={(el) => (observerRefs.current[0] = el)}
        >
          <h1>Discover Your Next Favorite</h1>
          <p>Search, explore, and find the perfect dining experience.</p>
          <a href="#menu" className="hero-button">Explore Specialties</a>
        </div>
      </div>
      
      {/* --- RICH CONTENT SECTION (Slide-in Left) --- */}
      <section 
        className="rich-content-section scroll-slide-left"
        ref={(el) => (observerRefs.current[1] = el)}
      >
        <div className="content-box">
          <h2>🍽️ Our Culinary Philosophy</h2>
          <p>
            At **The Royals**, every dish is a masterpiece crafted from locally sourced, 
            seasonal ingredients. We blend classic French techniques with modern culinary 
            artistry to deliver a dining experience that is both elegant and unforgettable. 
            Our commitment is to **quality, innovation, and sustainability** in every bite.
          </p>
          <p>
            We believe that great food starts with great ingredients. That's why we partner 
            directly with local farms and fisheries to ensure maximum freshness and support 
            our community.
          </p>
        </div>
      </section>

      {/* --- NEW: WHY CHOOSE US? SECTION (Slide-in Right) --- */}
      <section 
        className="why-choose-us-section scroll-slide-right"
        ref={(el) => (observerRefs.current[2] = el)}
      >
        <h2>✨ Why Choose The Royals?</h2>
        <div className="feature-grid">
            <div className="feature-card">
                <h3>Uncompromising Quality</h3>
                <p>Only the freshest, highest-grade ingredients make it to your plate.</p>
            </div>
            <div className="feature-card">
                <h3>Exceptional Service</h3>
                <p>Our dedicated staff ensures a flawless and attentive dining experience from start to finish.</p>
            </div>
            <div className="feature-card">
                <h3>Elegant Atmosphere</h3>
                <p>Dine in a lavish, yet comfortable setting perfect for any special occasion.</p>
            </div>
        </div>
      </section>

      {/* --- FOOD SPECIALTIES & MENU SECTION (Slide-in Left) --- */}
      <section 
        id="menu" 
        className="menu-section scroll-slide-left"
        ref={(el) => (observerRefs.current[3] = el)}
      >
        <h2>🔥 Chef's Specialties & Menu</h2>
        <p className="menu-subtitle">Explore our most popular and highly recommended dishes.</p>
        
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`menu-card ${index % 2 === 0 ? 'scroll-slide-right' : 'scroll-slide-left'}`}
              ref={(el) => (observerRefs.current[4 + index] = el)}
            >
              <img src={item.img} alt={item.name} className="menu-image" />
              <div className="card-content">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">Price: **{item.price}**</p>
                <div className="suggestion">
                  **Chef's Suggestion:** {item.suggestion}
                </div>
              </div>
            </div>
          ))}
        </div>
        
{/*         <Link to="/full-menu" className="full-menu-button">View Complete Digital Menu</Link> */}
      </section>

      {/* --- RATING & REVIEWS SECTION (Slide-in Right) --- */}
      <section 
        className="reviews-section scroll-slide-right"
        ref={(el) => (observerRefs.current[13] = el)}
      >
        <h2>⭐️ Customer Ratings & Reviews</h2>
        <p className="reviews-summary">Hear what our guests are saying about their experience.</p>
        
        <div className="review-grid">
          {reviews.map((review, index) => (
            <div key={index} 
                 className={`review-card ${index % 2 === 0 ? 'scroll-slide-left' : 'scroll-slide-right'}`}
                 ref={(el) => (observerRefs.current[14 + index] = el)}>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">- Satisfied Guest {index + 1}</p>
            </div>
          ))}
        </div>
        
        <a href="#review-form" className="submit-review-link">Submit Your Review!</a>
      </section>
      
      {/* --- FOOTER SECTION (Slide-in Left) --- */}
      <footer 
        className="main-footer scroll-slide-left"
        ref={(el) => (observerRefs.current[17] = el)}
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
<br></br>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
<br></br>

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

export default HomePage;