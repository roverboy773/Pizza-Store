const razorpay = require('razorpay')
const crypto=require('crypto')

function paymentController() {
    return {
        async order(req, res) {
            try {
                const instance = new razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_SECRET,
                })
                const options = {
                    amount: req.session.cart.totalPrice * 100, // amount in smallest currency unit
                    currency: "INR",
                    receipt: "receipt_order_1111",
                };

                const order = await instance.orders.create(options);

                if (!order) return res.status(500).send("Some error occured");

                res.json(order);
            } catch (err) {
                res.status(500).send(err);
            }
        },
        async verify(req, res) {
          try{
                const{orderCreationId,razorpayPaymentId,razorpayOrderId,razorpaySignature}=req.body
                
                const shasum = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET.toString());
                 
                 shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

                 const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
            }catch(err){
                res.status(500).send(err);
             }
        }
    }
}
module.exports = paymentController
