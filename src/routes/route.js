
const homeController=require("../http/controllers/homeController");
const authController=require("../http/controllers/authController");
const cartController=require("../http/controllers/cartController");
const orderController=require("../http/controllers/orderController");
const adminController=require("../http/controllers/adminController");
const isLoggedin=require("../http/middlewares/restricted");
const onlyAdmin=require("../http/middlewares/onlyAdmin");
const order = require("../models/order");
const passport=require('passport');

const passportLocal=require("../config/passport_local");
const passportGoogleAuth=require("../config/passportGoogleAuth");


function routes(app){

app.get('/',homeController().index);
//cart
app.get('/cart',cartController().index);
app.post('/update-cart',cartController().update);
//order
app.get('/orders',orderController().orders);
app.post('/orders',orderController().postOrder);
app.get('/order/:id',orderController().order);
//auth
app.get('/login',isLoggedin,authController().loginType)
app.get('/register',isLoggedin,authController().register)
app.get('/login/email',isLoggedin,authController().loginEmail)

//passport local auth
app.post('/login', passportLocal,
  passport.authenticate('local', { failureRedirect: '/login/email' }),
  function(req, res) {
    res.redirect('/');
  });

 //passport google auth 
app.get('/google',passportGoogleAuth,
  passport.authenticate('google', { scope: ['profile','email'] }));

  app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.

    res.redirect('/');
  });


app.post('/register',authController().postRegister);
app.post('/logout',authController().logout);


//Admin routes
app.get('/admin/orders',onlyAdmin,adminController().index)
app.post('/admin/order/status',onlyAdmin,adminController().status);
}
module.exports=routes;