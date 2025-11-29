import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Signup.jsx";
import Landing from "./Landing.jsx";
import Login from "./Login.jsx";
import Home from "./Homepage.jsx";
import HomePage from "./Homepage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import TeamPage from "./TeamPage.jsx";
import AboutUsPage from "./AboutUsPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
