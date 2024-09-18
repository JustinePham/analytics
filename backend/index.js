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
//In development, secure: false should be used because you're running over http. 
//In production (when using HTTPS), set it to true.
app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: false, cookie: {
  secure: false,  // Set to 'true' in production if using HTTPS
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000  // 1 day cookie expiration
} }));

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
    profile.accessToken = accessToken;
    console.log('TOKEN: ',accessToken)
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
app.get('/auth/github', 
  passport.authenticate('github', { scope: ['user:email'] }),
  (req, res) => {
    
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = 'http://localhost:4000/auth/github/callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}/integrations/github/oauth2/callback&scope=user`;
  
    res.redirect(githubAuthUrl);
  }
);

app.get(
  '/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }), 
  (req, res) => {
    const accessToken = req.user.accessToken
    // On successful authentication, Passport will store the access token in the session
    console.log('User authenticated:', req.user);
    console.log('User token:', req.user.accessToken);
    res.redirect(`http://localhost:5173/home`);
  }
);

// Get user data if authenticated
app.get('/auth/user', async (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`OAuth server running at http://localhost:${PORT}`);
});

