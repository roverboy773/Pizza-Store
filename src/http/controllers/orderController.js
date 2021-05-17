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
                const { phone, address } = req.body;
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
                    items: req.session.cart.items,
                    customerID: custID
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
                    res.redirect('/orders')
                }
                // Order.populate(result,{path:'customerID'},(err,result)=>{
                //     req.flash('success', "Order Placed Successfully");
                //     delete req.session.cart;
                //     //emiiter
                //     const eventEmitter=req.app.get('eventEmitter');
                //     eventEmitter.emit('reflectOrder',{result,message:'New Order Placed'})
                //    // console.log(`orderController-reflectOrder  ${eventEmitter}`);
                //     return res.redirect('/orders');
                // })





                // if(saved){
                //     const populated=await saved.populate('customerID')

                //     req.flash('success', "Order Placed Successfully");
                //         delete req.session.cart;
                //         const eventEmitter=req.app.get('eventEmitter');
                //         eventEmitter.emit('reflectOrder',{saved,message:'New Order Placed'})
                //        // console.log(`orderController-reflectOrder  ${eventEmitter}`);
                //         return res.redirect('/orders');
                // }
                // .then((result) => {
                //     Order.populate(result,{path:'customerID'},(err,result)=>{
                //         req.flash('success', "Order Placed Successfully");
                //         delete req.session.cart;
                //         //emiiter
                //         const eventEmitter=req.app.get('eventEmitter');
                //         eventEmitter.emit('reflectOrder',{result,message:'New Order Placed'})
                //        // console.log(`orderController-reflectOrder  ${eventEmitter}`);
                //         return res.redirect('/orders');
                //     })

                // })
            } catch (err) {
                console.log(`Error-> ${err}`)
            }
        }
    }
}

module.exports = orderController;