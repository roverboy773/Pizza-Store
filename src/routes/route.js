
const homeController=require("../http/controllers/homeController");
const authController=require("../http/controllers/authController");
const cartController=require("../http/controllers/cartController");
const orderController=require("../http/controllers/orderController");
const adminController=require("../http/controllers/adminController");
const isLoggedin=require("../http/middlewares/restricted");
const onlyAdmin=require("../http/middlewares/onlyAdmin");
const order = require("../models/order");

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
app.get('/login',isLoggedin,authController().login)
app.get('/register',isLoggedin,authController().register)
app.post('/login',authController().postLogin)
app.post('/register',authController().postRegister);
app.post('/logout',authController().logout);



//Admin routes
app.get('/admin/orders',onlyAdmin,adminController().index)
app.post('/admin/order/status',onlyAdmin,adminController().status);
}
module.exports=routes;