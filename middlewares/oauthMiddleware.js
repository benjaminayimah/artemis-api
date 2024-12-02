const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/google/callback',
        passReqToCallback: true
    },
      (req, accessToken, refreshToken, profile, done) => {
        // User.findOrCreate({ googleId: profile.id }, (err, user) => {
        //     return done(null, profile);
        // })
        // console.log(profile)

        // if(req.isAuthenticated()) {
        //     console.log('Is Authenticated')
        // }else {
        //     console.log('Not Authenticated')
        // }

        // console.log(done())
        // console.log(request.logOut())
        

        // request.logOut()
        return done(null, profile)
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
  
  