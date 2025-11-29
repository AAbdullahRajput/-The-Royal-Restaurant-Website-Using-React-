import React, { useState, useEffect } from "react";
import "./css/Landing.css";
import rest1 from "./images/rest1.jpg";
import rest2 from "./images/rest2.jpg";
import rest3 from "./images/rest3.jpg";
import rest4 from "./images/rest4.jpg";

// Array of slides with captions and dynamic color
const slides = [
  {
    img: rest1,
    caption: "Explore the world: Travel, Adventure, Memories",
    color: "#ffffffff" // Gold
  },
  {
    img: rest2,
    caption: "Healthy Eating: Fresh, Nutritious, Delicious",
    color: "#ffffffff" // Spring green
  },
  {
    img: rest3,
    caption: "Breathtaking Views: Nature, Mountains, Serenity",
    color: "#ffffffff" // Sky blue
  },
  {
    img: rest4,
    caption: "Culinary Journey: Taste, Culture, Joy",
    color: "#ffffffff" // Orange red
  },
];

export default function Landing() {
  const [index, setIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(auto);
  }, []);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${slides[index].img})` }}
    >
      <div className="overlay"></div>

      {/* TOP RIGHT NAV */}
      <div className="top-right" style={{ "--link-color": slides[index].color }}>
        <a href="/login">LOG IN</a>
        <a href="/signup">SIGN UP</a>
      </div>

      {/* CENTER BRAND */}
      <div className="brand-title" style={{ color: slides[index].color }}>
        THE ROYALS
      </div>

      {/* SLIDER ARROWS */}
      <div className="arrow arrow-left" onClick={prev} style={{ color: slides[index].color }}>
        &lt;
      </div>
      <div className="arrow arrow-right" onClick={next} style={{ color: slides[index].color }}>
        &gt;
      </div>

      {/* BOTTOM LEFT CAPTION */}
      <div className="caption" style={{ color: slides[index].color }}>
        <div className="caption-box">{slides[index].caption}</div>
      </div>
    </div>
  );
}
