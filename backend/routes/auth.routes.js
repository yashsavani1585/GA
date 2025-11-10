// routes/auth.routes.js
import express from "express";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FRONTEND_URL,
  JWT_SECRET,
} = process.env;

const oauth2Client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_CALLBACK_URL,
});

// Helper to make JWT for your app
const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

// In-memory state store for OAuth states (use Redis in production for multiple servers)
const oauthStates = new Map();

// Cleanup expired states every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [state, data] of oauthStates.entries()) {
    if (now - data.timestamp > 15 * 60 * 1000) { // 15 minutes expiry
      oauthStates.delete(state);
    }
  }
}, 10 * 60 * 1000);

// Step 1: kick off Google OAuth (full-page redirect)
router.get("/google", async (req, res) => {
  try {
    // CSRF-safe state
    const state = crypto.randomBytes(16).toString("hex");
    // Where to send the user back on *your* frontend after success
    const returnTo = req.query.redirect || FRONTEND_URL;

    // Store in session
    req.session.oauthState = state;
    req.session.returnTo = returnTo;

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",
      scope: ["openid", "email", "profile"],
      state,
    });
    res.redirect(url);
  } catch (e) {
    console.error("❌ Auth start error:", e);
    res.status(500).send("Failed to start Google auth.");
  }
});

// Step 2: Google callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    // Validate state
    if (!state || state !== req.session.oauthState) {
      return res.redirect(
        `${FRONTEND_URL}/oauth/callback?error=${encodeURIComponent("Invalid OAuth state")}`
      );
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get profile info
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const email = (payload?.email || "").toLowerCase();
    const firstName = payload?.given_name || "";
    const lastName = payload?.family_name || "";
    const googleId = payload?.sub;
    const photo = payload?.picture || null;

    if (!email) {
      return res.redirect(
        `${FRONTEND_URL}/oauth/callback?error=${encodeURIComponent("No email returned from Google")}`
      );
    }

    // Find or create user
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        googleId,
        photo,
        authProvider: "google",
      });
    } else {
      // If this account was email/password originally and you want to **prevent**
      // takeover by Google, keep this check. Otherwise, you could link googleId.
      if (user.authProvider === "jwt" && !user.googleId) {
        user.googleId = googleId; // optional linking
      }
      user.lastLogin = Date.now();
      await user.save();
    }

    const token = createToken(user._id);

    const returnTo = req.session.returnTo || FRONTEND_URL;
    // Clean session values
    req.session.oauthState = undefined;
    req.session.returnTo = undefined;

    // Redirect to frontend callback page with your JWT
    return res.redirect(
      `${returnTo}/oauth/callback?token=${encodeURIComponent(token)}`
    );
  } catch (e) {
    console.error("Auth callback error:", e);
    return res.redirect(
      `${FRONTEND_URL}/oauth/callback?error=${encodeURIComponent("Google auth failed")}`
    );
  }
});

export default router;
