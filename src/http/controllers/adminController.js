
const Order=require("../../models/order");
function adminController() {
    return {
        async index(req, res) {
          const orders=await Order.find({status:{$ne:'completed'}})
           .populate('customerID','-password').sort({createdAt:-1});
         //  console.log(orders)
           if(orders){
               if(req.xhr)
                { //console.log(xhr)
                    return res.json(orders)
                }
                return res.render('admin');
           }
        },
        async status(req,res){
            const updated=await Order.updateOne({_id:req.body.orderId},{status:req.body.status});
            if(updated){
                const eventEmitter=req.app.get('eventEmitter');
    
                eventEmitter.emit('orderStatus',updated)
             return res.redirect("/admin/orders");
            }
            else{
                req.flash('error','Something went wrong Kindly try again');
              return res.redirect('/admin/orders');
            }

        }
    }
}

module.exports=adminController;