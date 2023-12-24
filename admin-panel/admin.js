const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/adminPanelDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Configure passport
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:3000/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  // You can save user details in the database here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Express middleware
app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/login', (req, res) => {
  res.send('Login Page');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/admin');
  }
);

app.get('/admin', (req, res) => {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    res.send('Admin Panel');
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
