const User = require('../models/user')
const mongoose=require('mongoose');
const passport=require('passport');


async function helper(req,res) {
    try {
        const user = await User.find({ email: req.user.emails[0].value })
    
        if (user.length) {
            return res.redirect('/')
        }
        let newuser = new User({
            name: req.user.displayName,
            email: req.user.emails[0].value,
        })

        const saved = await newuser.save();
         console.log(saved)

        if (saved) 
             return  res.redirect('/')
        else console.log('not saved')
        //console.log(req.session)
         
        res.redirect('/')
    } catch (e) {
        //console.log(e);
    }
}

module.exports = helper