const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserTT = require('../models/userTimeTable.model');
const ClassSubject = require('../models/classSubject.model');
const Subject = require('../models/subject.model');
const Class = require('../models/class.model');
const bcrypt = require('bcryptjs');
const Response = require('../response');
const mongoose = require('mongoose');
const mongodb = require('mongodb')
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


module.exports.profileupdate=async (req,res,next)=>{
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
    await UserTT.findOne({user_id : req.query.user_id}).then(result => {
        var data = [];
        var obj = {
            id :{type:String},
            no :{type : String},
            name: {type:String},
            sub : {type:String}
        };
        var oob =[obj];
        const today  = new Date().getDay();
        var weekDay = ['sun','mon','tue','wed','thr','fri','sat'];
        //console.log(weekDay[today]);
        var csids = [];
        const currentTimeTable = result[weekDay[today-3]];
        data = currentTimeTable;
        //console.log(data);
        currentTimeTable.forEach(element => {
            csids.push(element.classSubject_id);
        });
        //console.log(csids)
        csids.forEach(val => {
            ClassSubject.findOne({ _id : val }).then(allowd => {
                    //console.log(allowd)
                Class.findOne({ _id : allowd.class_id }).then(wished =>{
                    // var classsubject = [{id :{type : String},classno : {type :String},classname : {type : String},subjectname : {type :String}}];
                    obj.id = wished._id;
                    //console.log(wished)
                     obj.no = wished.roomNumber;
                     obj.name = wished.name;
                     Subject.findOne({ _id : allowd.subject_id }).then( nameofsub => {
                         obj.sub = nameofsub.name;
                         console.log(obj);
                         oob.push(obj)
                     } , errorsub => {res.send('tooooooo error')});

                    
                } , unwished => {res.send('bigbig error')});
            }, unallowed => {res.send("Big error")});
        });
         console.log(oob);
    }, error => {
        res.send('Error');
    });
}