const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const Response = require('../response');

module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password); 
        const token = await user.generateAuthToken();
        const resData = {userID : user._id, userToken : token };
        new Response(200).setData(resData).send(res);
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
                new Response(409).send(res);
            });
}

module.exports.profileupdate=async (req,res,next)=>{
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
module.exports.timeTable = async (req,res) => {
    
}