let FacebookStrategy = require('passport-facebook').Strategy;
const passport=require('passport')

function passportFacebook(req,res,next){

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://peppi-pizza-store.herokuapp.com/facebook/callback",
    profileFields: ['id', 'email', 'name','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(`profile ${profile}`)
      return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
       done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
         done(null, user);
    });

next();
}

module.exports=passportFacebook;