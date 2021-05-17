function cartController(){
    return {
          index(req,res){
              res.render('cart');
          },
          update(req,res){
       // check if cart doesnt exists
       
             if(!req.session.cart){
                 req.session.cart={
                     items:{ },
                     totalPrice:0,
                     totalQty:0
                 }
             }
             let cart=req.session.cart;
             
             //check if item dont exists in cart
             if(!cart.items[req.body._id]){
                 cart.items[req.body._id]={
                     items:req.body,
                     qty:1 
                 }
                 cart.totalPrice=cart.totalPrice + req.body.price,
                 cart.totalQty=cart.totalQty + 1;
             }else{
                 cart.items[req.body._id].qty=cart.items[req.body._id].qty + 1;
                 cart.totalQty=cart.totalQty + 1;
                 cart.totalPrice=cart.totalPrice + req.body.price;
             }
            // console.log(req.session);
                return res.json({totalqty:req.session.cart.totalQty});
          }
    }
}

module.exports=cartController;