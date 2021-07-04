const Order = require("../../models/order");
const moment = require('moment');
const mongoose = require("mongoose");

function orderController() {
    return {
        async orders(req, res) {

            let CustID = null;
            if (req.session.passport.user._id)
                custID = req.session.passport.user._id
            else
                custID = req.session.passport.user

            const orders = await Order.find({ customerID: custID }).sort({ createdAt: -1 });
            res.render('orders', { orders: orders, moment: moment });
        },
        async order(req, res) {

            let CustID = null;
            if (req.session.passport.user._id)
                custID = req.session.passport.user._id
            else
                custID = req.session.passport.user

            const result = await Order.find({ _id: req.params.id });
            //authorize whether it is the same user who ordered
            if (result) {
                if (custID.toString() === result[0].customerID.toString()) {
                    return res.render('singleOrder', { order: result[0] });
                } else {
                    return res.redirect("/");
                }
            }
        },
        async postOrder(req, res) {
            try {
                //  console.log(req.body);   
                //validate request
                const { phone, address,paymentOrderId,paymentId } = req.body;
                if (!phone || !address) {
                    req.flash('error', 'All fields required');
                    return res.redirect('/cart')
                }
                let CustID = null;
                if (req.session.passport.user._id)
                    custID = req.session.passport.user._id
                else
                    custID = req.session.passport.user

                const order = new Order({
                    phone,
                    address,
                    paymentOrderId,
                    paymentId,
                    items: req.session.cart.items,
                    customerID: custID,
                    totalPrice:req.session.cart.totalPrice*100,
                   
                })
                const saved = await order.save()
                if (saved) {
                    const result = await Order.find({ customerID: custID })
                        .populate('customerID', '-password')
                   // console.log(result)

                    req.flash('success', 'Order Placed Successfully')
                    delete req.session.cart
                    // adding new order to admin at the same time
                    
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('reflectOrder', { result, message: 'New order Placed' })
                   
                    res.json({redirect:'/orders'})
                }
                
            } catch (err) {
                console.log(`Error-> ${err}`)
            }
        }
    }
}

module.exports = orderController;