
const homeController = require("../http/controllers/homeController");
const authController = require("../http/controllers/authController");
const cartController = require("../http/controllers/cartController");
const orderController = require("../http/controllers/orderController");
const addOnController=require('../http/controllers/addOnsController')
const adminController = require("../http/controllers/adminController");
const paymentController=require("../http/controllers/paymentContoller")
const isLoggedin = require("../http/middlewares/restricted");
const onlyAdmin = require("../http/middlewares/onlyAdmin");
const User = require("../models/user");
const passport = require('passport');

const passportLocal = require("../config/passport_local");
const passportGoogleAuth = require("../config/passportGoogleAuth");
const passportFacebook = require('../config/passportFacebook');
const helper=require('../config/SaveGoogleUsertoDB');

function routes(app) {

  app.get('/', homeController().index);
  //cart
  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);
  app.post('/remove-cart', cartController().remove);
  app.post('/deleteItem',cartController().delete)
  //addons
  app.post('/addOns',addOnController().add)
  app.post('/removeAddOns',addOnController().remove)
  //order
  app.get('/orders', isLoggedin,orderController().orders);
  app.post('/orders', orderController().postOrder);
  app.get('/order/:id', isLoggedin, orderController().order);
//payment
  app.post('/payment/order',paymentController().order)
  app.post('/payment/order/success',paymentController().verify)
  //auth
  app.get('/login', authController().loginType)
  app.get('/register', authController().register)
  app.get('/login/email', authController().loginEmail)

  //passport local auth
  app.post('/login', passportLocal,
    passport.authenticate('local', { failureRedirect: '/login/email' }), (req, res)=> res.redirect('/'));

  //passport google auth 
  app.get('/google', passportGoogleAuth,
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),(req,res)=>helper(req,res))

  //passport facebook auth
  app.get('/facebook', passportFacebook,
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

  app.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),(req,res)=>helper(req,res));

  app.post('/register', authController().postRegister);
  app.post('/logout', authController().logout);


  //Admin routes
  app.get('/admin/orders', onlyAdmin, adminController().index)
  app.post('/admin/order/status', onlyAdmin, adminController().status);
}
module.exports = routes;