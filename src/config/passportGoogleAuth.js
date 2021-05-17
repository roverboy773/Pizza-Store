let GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport=require('passport')


function passportGoogle(req,res,next) {

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(profile)
      return done(null, profile);
    }
));


passport.serializeUser(function(user, done) {
    //console.log(`gauth serializer ${user}`)
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    //console.log(`gauth deserializer ${user}`)
      done(null, user);
    });
  
    next();
}

module.exports=passportGoogle;