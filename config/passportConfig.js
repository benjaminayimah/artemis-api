// passportConfig.js
const User = require('../models/User');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
// const { createOauthUser } = require('../controllers/AuthController');  // Import the controller

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/google/callback',
        passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
        // try {
        //     // Call the controller to handle user creation
        //     const user = await createOauthUser(profile);

        //     // Pass the user to the done callback (this will add the user to req.user)
        // } catch (err) {
        //     return done(err, null);
        // }
        return done(null, profile);

    }
));

// Serialize and deserialize user (for session management)
passport.serializeUser((user, done) => {
  done(null, user.id);  // You can store any user identifier (e.g., email, user ID)
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Find user by stored ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
