// backend/index.js
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 4000;

// CORS setup to allow frontend requests
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Session setup
app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/github/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // You can use the profile information in your app here.
    return done(null, profile);
  }
));

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the OAuth Backend');
});

// GitHub Auth route
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Auth Callback route
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to frontend after successful login
    res.redirect('http://localhost:5173/home');
  }
);

// Get user data if authenticated
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`OAuth server running at http://localhost:${PORT}`);
});
