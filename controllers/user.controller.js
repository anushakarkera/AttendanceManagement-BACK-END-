const jwt = require('jsonwebtoken');
//const fs = require('fs');

const User = require('../models/user.model');
const UserTT = require('../models/userTimeTable.model');
const ClassSubject = require('../models/classSubject.model');
const Subject = require('../models/subject.model');
const Class = require('../models/class.model');

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Response = require('../response');

const randomString = require('randomstring');

const mail = require('../middleware/mail');

const OTP = require('../models/otp.model');


module.exports.login = async (req, res) => {
    try {
        //Comment: use any 1 approach (either object.assign (refer signup API) or variable method)
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        const resData = { userToken: token };
        new Response(200).setData(resData).send(res);
    } catch (error) {
        new Response(401).send(res);
    }
}

module.exports.signup = (req, res, next) => {
    var user = new User();
            //Comment: use any 1 approach (either variable method (refer login API or this))
    Object.assign(user, req.body);
    user.save()
        .then(value => {
            //comment: response code is 200?
            new Response(201).send(res);
        })
        .catch (err => {
            if(err.name==='ValidationError')
                new Response(400).setError('Required Field Missing').send(res)
            else    
                new Response(409).send(res);
        
        });
}

module.exports.profile = async (req, res, next) => {
    try {
        //Comment : why _id:false, _v:false??
        const userDetails = await User.findOne({ _id: req.userID }, { _id: false, __v: false, password: false, token: false });
        new Response(200).setData(userDetails).send(res);
    }
    catch (err) {
        new Response(404).send(res);
    }
}

module.exports.profileUpdate=async (req,res,next)=>{
    var bodyinput = req.body;
    if (bodyinput['password'])
        bodyinput['password'] = await bcrypt.hash(bodyinput['password'], Math.random())
    User.findOneAndUpdate({ _id: req.userID }, { $set: bodyinput })
        .then(value => {
            new Response(200).send(res);
        })
        .catch(err => {
            if (bodyinput['email'])
                new Response(409).send(res)
            else
                new Response(422).send(res);
        })
}

module.exports.forgotPassword = async (req, res, next) => {
    var userEmail = req.body.email;
    User.findOne({ email: userEmail }, { email: true })
        .then(retrievedValue => {
            if (!retrievedValue) throw ('email not found')
            const temporaryPassword = randomString.generate({
                charset: userEmail
            }, reason => { });

            mail(userEmail, temporaryPassword);

            const searchFilter = { email: userEmail }
            const dataToBeUpdated = {
                otp: temporaryPassword,
                expireAt: Date.now()
            }
            OTP.findOneAndUpdate(searchFilter, dataToBeUpdated, {
                new: true,
                upsert: true

            }).then(value => {
                new Response(200).send(res);
            }, reason => {
                new Response(404).send(res);
            })

        }, reason => {
            new Response(409).send(res);
        })
        .catch(err => {
            new Response(409).send(res);
        })

}

module.exports.newPassword = async (req, res, next) => {

    const existingOTP = await OTP.findOne({ email: req.body.email }, { otp: true })
    if(!existingOTP) new Response(409).send(res)
    
    else if ((existingOTP.otp === req.body.otp)) {
        var recievedPassword = req.body.password;
        if (recievedPassword)
            recievedPassword = await bcrypt.hash(recievedPassword, Math.random())
        User.findOneAndUpdate({ email: req.body.email }, { password: recievedPassword })
            .then(value => {
                OTP.deleteOne({ email: req.body.email }).then(updated => {
                    new Response(200).send(res);
                })
            }, reason => {
                new Response(422).send(res);
            });
    }
    else {
        new Response(400).setError('Invalid OTP').send(res);
    }
}





module.exports.timeTable = async (req, res)=> {
    
    const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
    const today  = new Date().getDay();
    await UserTT.findOne({user_id : req.userID }, { [weekDay[today]] : true }).then(result => {
        result[weekDay[today]].forEach(element => {

            ClassSubject.aggregate([{$match : { _id : element.classSubject_id}},
            {$project : { _id :1 }},



            {$lookup : {
                from : 'classes',
                localField : 'class_id',
                foreignField : '_id',
                as : 'ccids'
            }},
        //{$unwind : '$ccids'},
    {$lookup : {
        from : 'subjects',
        localField : 'subject_id',
        foreignField : '_id',
        as : 'sids'
    }


}], (err, ress) => {if(!err)console.log(ress);else console.log(err)});
            
            
        });


}).catch(error => { console.log(error);});

}

/*
    
        var data = [];
        var i = 0;
        const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const today  = new Date().getDay();

    await UserTT.findOne({user_id : req.userID} , {[weekDay[today]] : true }).then(result => {
        
        console.log(result);
        result[weekDay[today]].forEach(val => {

            ClassSubject.findOne({ _id : val.classSubject_id }).then(allowd => {
                    //console.log(allowd);
                Class.findOne({ _id : allowd.class_id }).then(wished =>{

                    Subject.findOne({ _id : allowd.subject_id }).then(complete => {

                        ++i;

                        var obj = {};

                        obj.classSubjectID = val.classSubject_id;
                        obj.className = wished.name;
                        obj.roomNumber = wished.roomNumber;
                        obj.subjectName = complete.name;
                        obj.time = val.time;
                        
                        data.push(obj);
                    
                        if(currentTimeTable.length === i){ 
                            
                            var a = data;
                            new Response(200).setData(a).send(res); }

                    }).catch(uncomplete => { new Response(404).send(res); });

                }).catch(unwished=>{ new Response(404).send(res); });
                   
            }).catch(unallowed => { new Response(404).send(res); });

        });

    }).catch(error => { new Response(404).send(res); });
  
}*/
module.exports.classTimetableList = async (req, res) => {
    var date = new Date(req.body.date);
var week = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
var day = date.getDay();
var k = await UserTT.aggregate([
    {$match : { user_id : req.userID }},
    {$project : { [week[day]] : 1 }}
]);
console.log(k[0][week[day]]);
}
