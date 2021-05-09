const User=require("../../models/user");
const bcrypt=require('bcrypt');
const passport=require('passport');

function authController(){
    return {
        login(req,res){
            res.render('login');
        },
        postLogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                        //(err,user,info) are passed by done(null,user,message)
                  if(err){
                   req.flash('error',info.message); 
                   return next(err);
                }
                if(!user){
                    req.flash('error',info.message); 
                   return res.redirect('/login');
                }
                req.logIn(user,(err)=>{
                     if(err){
                         req.flash('error',info.message);
                        return next(err);
                     }
                     return res.redirect("/")
                })
            })(req,res,next)
        },
        register(req,res){
            res.render('register');
        },
        async postRegister(req,res){
            const {name,email,password}=req.body;
             //validation
            if(!name || !email ||!password){
                req.flash('error','All fields are required!!!');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }

            const emailVerification=await User.find({email:email});
            if(emailVerification.length>0){
                req.flash('error','Email already Registered');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }
            //Hash password
            const hashedPassword=await bcrypt.hash(password,10)
            //create user
             const user=new User({
                 name:name,
                 email:email,
                 password:hashedPassword
             })

             const saved=await user.save();
                if(saved){
                    //auto login after registration
                  return res.redirect('/');
                }else{
                    req.flash('error','Something went wrong!')
                    return res.redirect('/register');
                }
        },
        logout(req,res){
            delete req.session.cart;
            req.logout();
            return res.redirect('/')
        }
    }
}

module.exports=authController;