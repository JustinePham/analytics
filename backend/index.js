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
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Set to true in production if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000  // 1 day cookie expiration
  }
}));

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
    // Store access token in profile
    profile.accessToken = accessToken;
    console.log('Access Token:', accessToken);
    return done(null, profile);  // Pass profile as the user object
  }
));

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Route for home page
app.get('/', (req, res) => res.send('Welcome to the OAuth Backend'));

// GitHub Auth Route
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Auth Callback Route
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }), 
  (req, res) => {
    // Redirect to the front end after successful authentication
    res.redirect('http://localhost:5173/home');
  }
);

// Route to check if user is authenticated and get user data
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);  // Send user data if authenticated
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout Route
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`OAuth server running at http://localhost:${PORT}`);
});