const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    
   customerID:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'user',
       required:true
   },
   items:{
       type:Object,
       required:true,
   },
   phone:{
       type:String,
       required:true,
   },
   address:{
       type:String,
       required:true,
   },
   paymentType:{
       type:String,
       default:'Cash on Delivery'
   },
   status:{
       type:String,
       default:'order placed',
   },
   totalPrice:{
       type:Number,
       required:true
   },
   currency:{
       type:String,
       required:true,
       default:'INR'
   },
   paymentOrderId:{
       type:String,
       required:true,
   },
   paymentId:{
       type:String,
       required:true
   }
},{timestamps:true})

module.exports= mongoose.model('order',orderSchema);