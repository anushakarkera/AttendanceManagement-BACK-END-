const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const Response = require('../response');
const mail=require('../middleware/mail');
const randomString=require('randomstring');
const OTP=require('../models/otp.model')

module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password); 
        const token = await user.generateAuthToken();
        const resData = {userID : user._id, userToken : token };
        new Response(200)
            .setStatus("SUCCESS")
            .setData(resData)
            .send(res);
    } catch (error) {
       new Response(401).send(res);
    }
}

module.exports.signup = (req,res,next) =>{
    var user = new User();
    Object.assign(user,req.body);
        user.save()
            .then( value => {
                new Response(201).send(res);   
            }, reason => {
;                new Response(409).send(res);
            });
}


module.exports.profile= async (req,res,next)=>{
    try{
            const result=await User.findOne({_id:req.params.id},{_id:false,_v:false,password:false,token:false});
                    
            new Response(200)
                .setStatus('SUCCESS')
                .setData(result)
                .send(res);

        }
        catch(err){
                 new Response(404).send(res);
        }
        
        
    }


module.exports.profileUpdate=async (req,res,next)=>{
    var bodyinput = req.body;
    if(bodyinput['password'])
        bodyinput['password'] = await bcrypt.hash(bodyinput['password'],Math.random())
    User.findOneAndUpdate({_id:req.params.id},{$set:bodyinput})
        .then(value =>{
            new Response(200).send(res);
        },reason => {
            new Response(422).send(res);
        });
}

module.exports.forgotPassword= async(req,res,next)=>{
    var userEmail=req.params.email;
        User.findOne({email:userEmail},{_id:true})
            .then(val => {
                const tempPass=randomString.generate({
                    charset:userEmail
                },reason=>{});
                mail(userEmail,tempPass);
                const filter={user_id:val._id}
                const update={otp:tempPass}
                 OTP.findOneAndUpdate(filter,update,{
                    new:true,
                    upsert:true
        
                }).then(value=>{
                    new Response(200).setData({userId:val._id}).send(res);
                },reason=>{
                    new Response(404).send(res);
                })
        
            })
                  
}



module.exports.newPassword= async(req,res,next)=>{
  
    const value= await OTP.findOne({user_id:req.params.id},{otp:true})
    if(value.otp === req.body.otp){
            var newPass=req.body.password;
            if(newPass)
                newPass = await bcrypt.hash(newPass,Math.random())
            User.findOneAndUpdate({_id:req.params.id},{password:newPass})
            .then(value =>{
                new Response(200).setData(newPass).send(res);
            },reason => {
                new Response(422).send(res);
            });
    } 
    else{
           new Response(400).setStatus('INVALID OTP').send(res);
    }

    
}
module.exports.timeTable = async (req,res) => {
    
}