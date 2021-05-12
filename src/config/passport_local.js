const Localstrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport=require('passport')

function passportInit(req,res,next) {

    passport.use(new Localstrategy({ usernameField: 'email' }, async (email, password, done) => {

        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'No user with this Email Found' });
        }
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in Successfully' });
            }
            return done(null, false, { message: 'Wrong Credentials' });
        }).catch(err => {
            return done(null, false, { message: 'Something Went Wrong' });
        })
    }))

    //to store info about logged in user ib session 
    passport.serializeUser((user, done) => {//user is passed only when credentials are ok
        //console.log(`local serializer ${user}`)
        done(null, user._id)
        //done(null,any user filter field)
        //this will get stored in  session
    })

    passport.deserializeUser((id, done) => {//id is the name given to whatever is stored in session
        console.log(id)
        User.findById(id, (err, user) => {
            //console.log(`local deserializer ${user}`)
            done(null, user)
        })
    })
 next();
}
module.exports = passportInit;