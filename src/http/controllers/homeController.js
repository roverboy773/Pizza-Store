const menu=require('../../models/menu')
const mongoose=require('mongoose');

function homeController(){
    return {
        async index(req,res){
           // const all=await menu.find().updateMany({image:'pizza.jpg'},{$set:{image:"pizza.png"}})
           const pizzas= await menu.find({category:"pizza"});
           const  pasta=await menu.find({category:'pasta'});
           const breads=await menu.find({category:'bread'});
           const deserts=await menu.find({category:'desert'});
           //console.log(pizzas,pasta,breads,deserts)
           res.render('home',{Menu:{pizzas,pasta,breads,deserts}});
        }
    }
}

module.exports=homeController;