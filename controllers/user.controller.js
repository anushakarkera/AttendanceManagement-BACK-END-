const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const Handler = require('./handler');
// const User = require('mongoose').model('User')
const Response = require('../response');


module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password); //throws exception if credential doesnt match
        const token = await user.generateAuthToken();
        const resData = {userID : user._id, userToken : token };
        new Response(200)
            .setMessage('User Login Authorised')
            .setData(resData)
            .send(res);
    } catch (error) {
       new Response(401).send(res);
    }

}

module.exports.signup = (req,res,next) =>{
    var user = new User();
    Object.assign(user,req.body);   // assigns data from req.body to user model
    user.save((err, doc) => {
        if (!err) 
            new Response(200)
                .setMessage('User Registration Successful')
                .setData(doc)
                .send(res);
        else
            new Response(409).send(res);
    });
}
module.exports.profileupdate=async (req,res,next)=>{
    var bodyinput = req.body;
    if(bodyinput['password'])
        bodyinput['password'] = await bcrypt.hash(bodyinput['password'],Math.random())
    var update={$set:bodyinput};
    User.findOneAndUpdate(
            {_id:req.params.id},update,
                    function(error,resp)
                    {   //code isn't tested, if it doesnt work revert it back
                        if(!error)  {
                            new Response(200)
                                .setMessage('Successfully Updated')
                                .send(res);}
                        else    
                            new Response(422).send(res); //Data to be sent is defined in '../response.js'
                    });
}

