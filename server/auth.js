import express from "express";
import bcrypt from "bcryptjs";
import User from "./User.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_CHANGE_THIS";
const JWT_EXPIRES = "7d";

// Create JWT token
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

/* =======================================================
   NORMAL SIGNUP
======================================================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ msg: "User already exists", error: true });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    return res.json({ msg: "Signup successful", error: false });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ msg: "Signup failed", error: true });
  }
});

/* =======================================================
   NORMAL LOGIN (email/password)
======================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "User not found", error: true });

    // Prevent Google-users from logging in with password
    if (user.provider === "google")
      return res.json({
        msg: "This account uses Google Login only",
        error: true,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ msg: "Invalid password", error: true });

    const token = createToken(user);

    return res.json({
      msg: "Login successful",
      user,
      token,
      error: false,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Login failed", error: true });
  }
});

/* =======================================================
   GOOGLE SIGN-IN / SIGN-UP (SECURE)
======================================================= */
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ error: true, msg: "Token missing" });

    // VERIFY GOOGLE TOKEN (MOST IMPORTANT SECURITY STEP)
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email)
      return res.json({ error: true, msg: "Invalid Google token" });

    if (!payload.email_verified)
      return res.json({ error: true, msg: "Google email not verified" });

    // Extract Google data
    const email = payload.email.toLowerCase();
    const name = payload.name || "Google User";
    const picture = payload.picture;
    const googleId = payload.sub;

    let user = await User.findOne({ googleId });

    // 1. If Google ID not found, check email
    if (!user) {
      const existing = await User.findOne({ email });

      if (existing) {
        // Link Google to existing local user
        existing.googleId = googleId;
        existing.provider = "google";
        if (!existing.picture) existing.picture = picture;
        await existing.save();
        user = existing;
      }
    }

    // 2. If still no user, create new Google-only user
    if (!user) {
      // Create internal hidden random password
      const hiddenPassword = await bcrypt.hash(
        Date.now().toString() + Math.random().toString(36),
        10
      );

      user = await User.create({
        name,
        email,
        picture,
        googleId,
        provider: "google",
        password: hiddenPassword,
      });
    }

    const authToken = createToken(user);

    return res.json({
      error: false,
      msg: "Google login successful",
      user,
      token: authToken,
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    res.status(500).json({ error: true, msg: "Google login failed" });
  }
});

export default router;
