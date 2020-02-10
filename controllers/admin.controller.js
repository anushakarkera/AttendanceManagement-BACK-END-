const User = require('../models/user.model');
const Response=require('../response')
module.exports.Deleteuser=async(req,res,next)=>{
    var id=req.body.email
    User.findOneAndDelete({email:id})
    .then(value => {
        new Response(200).send(res);
        console.log("Deleted Successfully!")
    })
    .catch(err => {
        new Response(404).send(res);
    })
}