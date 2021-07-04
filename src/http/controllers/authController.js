const User = require("../../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    return {
        loginType(req, res) {
            res.render('login');
        },
        loginEmail(req, res) {
            return res.render('loginEmail')
        },
        register(req, res) {
            res.render('register');
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;
            //validation
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required!!!');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            const emailVerification = await User.find({ email: email });
            if (emailVerification.length > 0) {
                req.flash('error', 'Email already Registered');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }
            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            //create user
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            const saved = await user.save();
            if (saved) {
                //auto login after registration
                saved.customerID = saved._id;
                await saved.save();
                return res.redirect('/');
            } else {
                req.flash('error', 'Something went wrong!')
                return res.redirect('/register');
            }
        },
        logout(req, res) {
            if (req.session.cart)
                delete req.session.cart
            // passport.deserializeUser(function(user,done){
            //    done(null,false)
            // })
            req.logout();
            return res.redirect('/')
        }
    }
}

module.exports = authController;