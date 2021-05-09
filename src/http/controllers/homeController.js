const menu=require('../../models/menu')
const mongoose=require('mongoose');

function homeController(){
    return {
        async index(req,res){
           const result= await menu.find();
             res.render('home',{pizzas:result});
        }
    }
}

module.exports=homeController;