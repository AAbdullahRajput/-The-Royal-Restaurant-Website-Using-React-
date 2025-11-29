import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import './css/Login.css';
import pastaImg from './images/pasta.jpg';
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Margherita Pizza", price: "$12", desc: "Classic pizza with mozzarella & tomato sauce", review: "⭐⭐⭐⭐", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80" },
  { name: "Cheeseburger", price: "$10", desc: "Juicy beef patty with cheddar and fresh veggies", review: "⭐⭐⭐⭐⭐", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80" },
  { name: "Pasta Alfredo", price: "$15", desc: "Creamy alfredo pasta with parmesan & herbs", review: "⭐⭐⭐⭐", img: pastaImg }
];

function Login() {

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [animationStep, setAnimationStep] = useState(0);
  const [current, setCurrent] = useState(0);
  const [fall, setFall] = useState(false);
  const navigate = useNavigate();

  // --------------------------
  // VALIDATION FUNCTIONS
  // --------------------------

  const validateEmail = (email) => {
    // must contain @ and domain
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return pattern.test(email);
  };

  // const validatePassword = (password, email) => {
  //   const emailName = email.split("@")[0];

  //   if (password.length < 8)
  //     return "Password too weak (min 8 characters)";

  //   // if (password.toLowerCase().includes(emailName.toLowerCase()))
  //   //   return "Password cannot be similar to email";

  //   // const strong = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
  //   // if (!strong.test(password))
  //   //   return "Include letters, numbers and symbols";

  //   return "";
  // };

  // --------------------------
  // HANDLE INPUT CHANGE
  // --------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    setForm(updated);

    // live validation
    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value)
          ? ""
          : "Invalid email format (example: name@gmail.com)"
      });
    }

    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value, updated.email)
      });
    }
  };

  // --------------------------
  // SUBMIT LOGIN
  // --------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // stop if errors
    if (errors.email || errors.password) {
      alert("Fix validation errors before logging in.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      if (res.data.error) {
        alert(res.data.msg);
      } else {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // --------------------------
  // GOOGLE LOGIN
  // --------------------------

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Google login error");
    }
  };

  // --------------------------
  // ANIMATIONS + SLIDER
  // --------------------------

  useEffect(() => setFall(true), []);
  useEffect(() => {
    const interval = setInterval(
      () => setAnimationStep((prev) => Math.min(prev + 1, 3)),
      300
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoSlide = setInterval(
      () => setCurrent((prev) => (prev + 1) % menuItems.length),
      4000
    );
    return () => clearInterval(autoSlide);
  }, []);

  const nextSlide = () => setCurrent((current + 1) % menuItems.length);
  const prevSlide = () => setCurrent((current - 1 + menuItems.length) % menuItems.length);

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="left-section">
        <div> <Link to="/home" className={`logo ${fall ? "fall" : ""}`} style={{ textDecoration: "none" }}>The Royals</Link></div>

        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menu-slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.img})` }}
          >
            <div className="menu-overlay"></div>
            <div className={`menu-info ${fall ? "fall" : ""}`}>
              <h3>{item.name}</h3>
              <p className="price">{item.price}</p>
              <p className="desc">{item.desc}</p>
              <p className="stars">{item.review}</p>
            </div>
          </div>
        ))}

        <span className="arrow arrow-left" onClick={prevSlide}>&lt;</span>
        <span className="arrow arrow-right" onClick={nextSlide}>&gt;</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
          
          <h2 className={animationStep >= 1 ? "slide-left fw-bold mb-3" : ""}>Login</h2>

          {/* EMAIL */}
          <div className={animationStep >= 2 ? "slide-right mb-2" : "mb-2"}
            style={{ opacity: animationStep >= 2 ? 1 : 0 }}>
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control"
              placeholder="Enter your email"
              onChange={handleChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          {/* PASSWORD */}
          <div className={animationStep >= 3 ? "slide-left mb-2" : "mb-2"}
            style={{ opacity: animationStep >= 3 ? 1 : 0 }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control"
              placeholder="Enter your password"
              onChange={handleChange}
            />
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 custom-btn mt-3">
            Login
          </button>

          <div className="w-100 mt-3">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Login Error")} />
          </div>

          <p className="text-center mt-3 text-muted">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
