
const homeController = require("../http/controllers/homeController");
const authController = require("../http/controllers/authController");
const cartController = require("../http/controllers/cartController");
const orderController = require("../http/controllers/orderController");
const adminController = require("../http/controllers/adminController");
const isLoggedin = require("../http/middlewares/restricted");
const onlyAdmin = require("../http/middlewares/onlyAdmin");
const User = require("../models/user");
const passport = require('passport');

const passportLocal = require("../config/passport_local");
const passportGoogleAuth = require("../config/passportGoogleAuth");
const passportFacebook = require('../config/passportFacebook');

function routes(app) {

  app.get('/', homeController().index);
  //cart
  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);
  app.post('/remove-cart', cartController().remove);
  //order
  app.get('/orders', isLoggedin, orderController().orders);
  app.post('/orders', orderController().postOrder);
  app.get('/order/:id', isLoggedin, orderController().order);
  //auth
  app.get('/login', authController().loginType)
  app.get('/register', authController().register)
  app.get('/login/email', authController().loginEmail)

  //passport local auth
  app.post('/login', passportLocal,
    passport.authenticate('local', { failureRedirect: '/login/email' }),
    function (req, res) {

      res.redirect('/');
    });

  //passport google auth 
  app.get('/google', passportGoogleAuth,
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async function (req, res) {
      // Successful authentication, redirect home after saving user to DB and adding _id tosession.

      const user = await User.find({ email: req.session.passport.user.emails[0].value })
      // console.log(user);
      if (user.length) {
        req.session.passport.user['_id'] = user[0]._id
        // console.log('returned')
        return res.redirect('/')
      }
      let newuser = new User({
        name: req.user.displayName,
        email: req.user.emails[0].value,
      })

      const saved = await newuser.save();
      //console.log(saved)
      if (saved) {
        req.session.passport.user['_id'] = saved._id
      }
      // console.log('saved')
      // console.log(req.session)
      res.redirect('/');
    });

  //passport facebook auth

  app.get('/facebook', passportFacebook,
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

  app.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async function (req, res) {
      // Successful authentication, redirect home.
      const user = await User.find({ email: req.session.passport.user.emails[0].value })
      // console.log(user);
      if (user.length) {
        req.session.passport.user['_id'] = user[0]._id
        // console.log('returned')
        return res.redirect('/')
      }
      let newuser = new User({
        name: req.user.displayName,
        email: req.user.emails[0].value,
      })

      const saved = await newuser.save();
      //console.log(saved)
      if (saved) {
        req.session.passport.user['_id'] = saved._id
      }
      // console.log('saved')
      // console.log(req.session)

      res.redirect('/');
    });

  app.post('/register', authController().postRegister);
  app.post('/logout', authController().logout);


  //Admin routes
  app.get('/admin/orders', onlyAdmin, adminController().index)
  app.post('/admin/order/status', onlyAdmin, adminController().status);
}
module.exports = routes;