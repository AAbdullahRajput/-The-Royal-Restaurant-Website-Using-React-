import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import './css/signup.css';
import pastaImg from './images/pasta.jpg';
import { useNavigate, useLocation, Link } from "react-router-dom";

const menuItems = [
  { 
    name: "Margherita Pizza", 
    price: "$12", 
    desc: "Classic pizza with mozzarella & tomato sauce", 
    review: "⭐⭐⭐⭐", 
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80" 
  },
  { 
    name: "Cheeseburger", 
    price: "$10", 
    desc: "Juicy beef patty with cheddar and fresh veggies", 
    review: "⭐⭐⭐⭐⭐", 
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80" 
  },
  { 
    name: "Pasta Alfredo", 
    price: "$15", 
    desc: "Creamy alfredo pasta with parmesan & herbs", 
    review: "⭐⭐⭐⭐", 
    img: pastaImg
  }
];

function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [animationStep, setAnimationStep] = useState(0);
  const [current, setCurrent] = useState(0);
  const [fall, setFall] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    return () => setForm({ name: "", email: "", password: "" });
  }, [location.pathname]);

  useEffect(() => {
    const handleBack = (e) => {
      e.preventDefault();
      navigate("/login", { replace: true });
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") validateEmail(e.target.value);
    if (e.target.name === "password") validatePassword(e.target.value);
  };

  const validateEmail = (email) => {
    if (!emailPattern.test(email)) {
      setEmailError("Provide a valid Gmail address (e.g., user@gmail.com)");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (password === form.name) {
      setPasswordError("Password too easy, same as name");
      return false;
    }
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must include uppercase, lowercase, digit, special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(form.email);
    const isPasswordValid = validatePassword(form.password);

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);

      if (!res.data.error) {
        setSuccessMsg(res.data.msg);
        setForm({ name: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setSuccessMsg("");
        alert(res.data.msg || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setSuccessMsg("");
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Google signup/login failed");
    }
  };

  useEffect(() => setFall(true), []);

  useEffect(() => {
    const interval = setInterval(
      () => setAnimationStep((prev) => Math.min(prev + 1, 5)),
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
  const prevSlide = () =>
    setCurrent((current - 1 + menuItems.length) % menuItems.length);

  return (
    <div className="signup-container">
      <div className="left-section">
        <div> <Link to="/home" className={`logo ${fall ? "fall" : ""}`} style={{textDecoration: "none"}}>The Royals</Link></div>
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

      <div className="right-section">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 className={animationStep >= 1 ? "slide-left fw-bold mb-3" : ""}>
            Sign up
          </h2>

          {/* ✅ Success animation popup */}
          {successMsg && (
            <div className="alert alert-success p-3 mb-3 text-center animate__animated animate__fadeInDown" style={{ borderRadius: "10px" }}>
              {successMsg}
            </div>
          )}

          <div className={animationStep >= 3 ? "slide-left mb-3" : "mb-3"} style={{ opacity: animationStep >= 3 ? 1 : 0 }}>
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" placeholder="Enter your name" onChange={handleChange} value={form.name} />
          </div>

          <div className={animationStep >= 4 ? "slide-right mb-3" : "mb-3"} style={{ opacity: animationStep >= 4 ? 1 : 0 }}>
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" placeholder="Enter your email" onChange={handleChange} value={form.email} />
            {emailError && <p className="text-danger small">{emailError}</p>}
          </div>

          <div className={animationStep >= 5 ? "slide-left mb-3" : "mb-3"} style={{ opacity: animationStep >= 5 ? 1 : 0 }}>
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Create a password" onChange={handleChange} value={form.password} />
            <small className="text-muted">Must be at least 8 characters.</small>
            {passwordError && <p className="text-danger small">{passwordError}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-100 custom-btn mt-3" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing up..." : "Get started"}
          </button>

          {/* <div className="w-100 mt-3">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Error")} />
          </div> */}

          <p className="text-center mt-3 text-muted">
            Already have an account? <a href="/Login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
