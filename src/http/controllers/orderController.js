const Order = require("../../models/order");
const moment = require('moment');

function orderController() {
    return {
        async orders(req, res) {
            const orders = await Order.find({ customerID: req.user._id }).sort({ createdAt: -1 });
            res.render('orders', { orders: orders, moment: moment });
        },
        async order(req, res) {
            const result = await Order.find({ _id: req.params.id });
            //authorize whether it is the same user who ordered
            if (result) {
                if (req.user._id.toString() === result[0].customerID.toString()) {
                    return  res.render('singleOrder', { order: result[0] });
                } else {
                    return res.redirect("/");
                }
            }
        },
        postOrder(req, res) {
            //  console.log(req.body);   
            //validate request
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields required');
                return res.redirect('/cart')
            }

            const order = new Order({
                phone,
                address,
                customerID: req.user._id,
                items: req.session.cart.items,
            })

            order.save().then((result) => {
                Order.populate(result,{path:'customerID'},(err,result)=>{
                    req.flash('success', "Order Placed Successfully");
                    delete req.session.cart;
                    //emiiter
                    const eventEmitter=req.app.get('eventEmitter');
                    eventEmitter.emit('reflectOrder',{result,message:'New Order Placed'})
                    console.log(`orderController-reflectOrder  ${eventEmitter}`);
                    return res.redirect('/orders');
                })
                
            }).catch((err) => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/cart')
            });
        }
    }
}

module.exports = orderController;