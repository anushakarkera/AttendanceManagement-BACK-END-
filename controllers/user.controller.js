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
            const userDetails=await User.findOne({_id:req.userID},{_id:false,__v:false,password:false,token:false});
                    
            new Response(200)
                .setStatus('SUCCESS')
                .setData(userDetails)
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
    var userEmail=req.body.email;
    console.log(req.headers.host);
        User.findOne({email:userEmail},{_id:true})
            .then(retrievedValue => {
                const temporaryPassword =randomString.generate({
                    charset:userEmail
                },reason=>{});
                mail(userEmail,temporaryPassword);
                
                if(retrievedValue){


                const searchFilter = {user_id:retrievedValue._id}
                const dataToBeUpdated =  {
                    otp:temporaryPassword,
                    expireAt:Date.now()}


                 OTP.findOneAndUpdate(searchFilter,dataToBeUpdated,{
                    new:true,
                    upsert:true
        
                }).then(value=>{
                    new Response(200).setData({userId:retrievedValue._id}).send(res);
                },reason=>{
                    new Response(404).send(res);
                })
            }
            else
            new Response(409).send(res);
            })
                  
}



module.exports.newPassword= async(req,res,next)=>{
  
    const existingOTP= await OTP.findOne({user_id:req.body.userID},{otp:true})
    if(existingOTP &&  (existingOTP.otp === req.body.otp)){
            var recievedPassword=req.body.password;
            if(recievedPassword)
                recievedPassword = await bcrypt.hash(recievedPassword,Math.random())
            User.findOneAndUpdate({_id:req.params.id},{password:recievedPassword})
            .then(value =>{
                new Response(200).setData(recievedPassword).send(res);
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