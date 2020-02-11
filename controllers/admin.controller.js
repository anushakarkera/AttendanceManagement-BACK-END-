const User = require('../models/user.model');
const Response=require('../response')
module.exports.Deleteuser=async(req,res,next)=>{
    var userid=req.body.id;
        User.findOneAndDelete({_id:userid},{_id:true},function(err,value){
            if(err) throw new Response(404).send(res)
        .then(value => {
            new Response(200).send(res);
        console.log("Deleted Successfully!")
    })
})
}