const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserTT = require('../models/userTimeTable.model');
const bcrypt = require('bcryptjs');
const Response = require('../response');

module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password); 
        const token = await user.generateAuthToken();
        const resData =  {userToken : token };
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


module.exports.profile= async (req,res,next)=>{
    try{
        const result=await User.findOne({_id:req.params.id});
        var doc={};
            doc.fullName=result.fullName;
            doc.email=result.email;
            doc.phone=result.phone;
            doc.gender=result.gender;
            doc.city=result.city;
        
        new Response(200)
            .setMessage('Succesful')
            .setData(doc)
            .send(res);

        }
        catch(err){
            new Response(404).send(res);
        }
        
    }


<<<<<<< HEAD
module.exports.profileUpdate=async (req,res,next)=>{

=======
module.exports.profileupdate=async (req,res,next)=>{
>>>>>>> 0fb39c838b12f8ff8ac0d2ed36de138e49759b63
    var bodyinput = req.body;
    if(bodyinput['password'])
        bodyinput['password'] = await bcrypt.hash(bodyinput['password'],Math.random())
    User.findOneAndUpdate({_id:req.userID},{$set:bodyinput})
        .then(value =>{
            new Response(200).send(res);
        },reason => {
            if(bodyinput['email'])
                new Response(409).send(res)
            else
                new Response(422).send(res);
        });
}

module.exports.timeTable = async (req,res) => {
await UserTT.findOne({ _id : req.query.user_id }).then(result => {
    res.send(result);
}, error => {
    res.send('Error');
});

}

module.exports.absentees=(req,res)=>{
    /*var absentStudents=new absentLog()
    Object.assign(absentStudents, req.params)
    absentStudents.save()
    .then( value => {
        new Response(201).send(res);   
    }, reason => {
        new Response(409).send(res);
    });*/
    /*var ids=req.body.id
    User.find({_id:{$in:ids}},function(err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result._id)
        var absentStudents=new Student()
        Object.assign(absentStudents, result._id)
        console.log(result._id)
        absentStudents.save()
        .then( value => {
        new Response(201).send(res);   
    }, reason => {
        new Response(409).send(res);
    })

   /* twil.messages.create({
        to:result.phone,
        from:'',
        body:'Student'+result.name+'is absent'
    })
    .then((message)=>console.log(message.sid))
      });
    })*/

}