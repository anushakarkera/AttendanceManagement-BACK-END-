const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const Response = require('../response');
const Student = require('../models/student.model');
//const accountSid=process.env.TWILIO_ACCOUNT_SID;
//const authToken=process.env.TWILIO_AUTH_TOKEN;
//const twil=require('twilio')(accountSid,authToken)


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
            if(bodyinput['email'])
                new Response(409).send(res)
            else
                new Response(422).send(res);
        });
}

module.exports.timeTable = async (req,res) => {
    
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