const User = require('../models/user.model');
const Response=require('../response')
module.exports.Deleteuser=async(req,res,next)=>{
    var userEmail=req.body.email;
        User.findOneAndDelete({email:userEmail},{email:true})
        .then(value => {
            if (!value) throw ('email not found')
            new Response(200).send(res);
        console.log("Deleted Successfully!")
    }/*,reason => {
        new Response(404).send(res)
    }*/)
    .catch(err => {
        new Response(404).send(res);
    })
}