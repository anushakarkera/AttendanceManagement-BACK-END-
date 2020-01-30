const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserTT = require('../models/userTimeTable.model');
const ClassSubject = require('../models/classSubject.model');
const Subject = require('../models/subject.model');
const Class = require('../models/class.model');
const bcrypt = require('bcryptjs');
const Response = require('../response');
const randomString = require('randomstring');
const mail = require('../middleware/mail');
const OTP = require('../models/otp.model')
const mongodb = require('mongodb')
module.exports.login = async (req, res) => {
    try {
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
    Object.assign(user, req.body);
    user.save()
        .then(value => {
            new Response(201).send(res);
        }, reason => {
            new Response(409).send(res);
        });
}


module.exports.profile = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ _id: req.userID }, { _id: false, __v: false, password: false, token: false });

        new Response(200)
            .setStatus('SUCCESS')
            .setData(userDetails)
            .send(res);

    }
    catch (err) {
        new Response(404).send(res);
    }

}


module.exports.profileUpdate = async (req, res, next) => {
    var bodyinput = req.body;
    if (bodyinput['password'])
        bodyinput['password'] = await bcrypt.hash(bodyinput['password'], Math.random())
    User.findOneAndUpdate({ _id: req.params.id }, { $set: bodyinput })
        .then(value => {
            new Response(200).send(res);
        }, reason => {
            new Response(422).send(res);
        });
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
                new Response(200).setStatus('SUCCESS').send(res);
            }, reason => {
                new Response(404).send(res);
            })

        }, reason => {
            console.log(reason)
            new Response(409).send(res);
        })
        .catch(err => {
           // console.log(err)
            new Response(409).send(res);
        })

}



module.exports.newPassword = async (req, res, next) => {

    const existingOTP = await OTP.findOne({ email: req.body.email }, { otp: true })
    if (existingOTP && (existingOTP.otp === req.body.otp)) {
        var recievedPassword = req.body.password;
        if (recievedPassword)
            recievedPassword = await bcrypt.hash(recievedPassword, Math.random())
        User.findOneAndUpdate({ email: req.body.email }, { password: recievedPassword })
            .then(value => {
                OTP.remove({ email: req.body.email }).then(updated => {
                    new Response(200).send(res);

                })

            }, reason => {
                new Response(422).send(res);
            });
    }
    else {
        new Response(400).setStatus('INVALID OTP').send(res);
    }
}


module.exports.profileupdate=async (req,res,next)=>{
    var bodyinput = req.body;
    if (bodyinput['password'])
        bodyinput['password'] = await bcrypt.hash(bodyinput['password'], Math.random())
    User.findOneAndUpdate({ _id: req.userID }, { $set: bodyinput })
        .then(value => {
            new Response(200).send(res);
        }, reason => {
            if (bodyinput['email'])
                new Response(409).send(res)
            else
                new Response(422).send(res);
        });
}

module.exports.forgotPassword= async(req,res,next)=>{
    var userEmail=req.params.email;
        User.findOne({email:userEmail},{_id:true})
            .then(val => {
                const tempPass=randomString.generate({
                    charset:userEmail
                },reason=>{});
                mail(userEmail,tempPass);
                const filter={user_id:val._id}
                const update={otp:tempPass}
                 OTP.findOneAndUpdate(filter,update,{
                    new:true,
                    upsert:true
        
                }).then(value=>{
                    new Response(200).setData({userId:val._id}).send(res);
                },reason=>{
                    new Response(404).send(res);
                })
        
            })
                  
}



module.exports.newPassword= async(req,res,next)=>{
  
    const value= await OTP.findOne({user_id:req.params.id},{otp:true})
    if(value.otp === req.body.otp){
            var newPass=req.body.password;
            if(newPass)
                newPass = await bcrypt.hash(newPass,Math.random())
            User.findOneAndUpdate({_id:req.params.id},{password:newPass})
            .then(value =>{
                new Response(200).setData(newPass).send(res);
            },reason => {
                new Response(422).send(res);
            });
    } 
    else{
           new Response(400).setStatus('INVALID OTP').send(res);
    }

    
}

module.exports.timeTable = async (req, res) => {

    await UserTT.findOne({ user_id : req.userID }).then(result => {
        var data = [];
        var i = 0;
        const weekDay = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        const today  = new Date().getDay();
       
        
        const currentTimeTable = result[weekDay[today-3]];

        currentTimeTable.forEach(val => {

            ClassSubject.findOne({ _id : val.classSubject_id }).then(allowd => {
                    
                Class.findOne({ _id : allowd.class_id }).then(wished =>{

                    Subject.findOne({ _id : allowd.subject_id }).then(complete => {

                        ++i;

                        var obj = {};

                        obj.classid = allowd._id;
                        obj.classname = wished.name;
                        obj.classnum = wished.roomNumber;
                        obj.subname = complete.name;
                        obj.timing = val.time;
                        
                        data.push(obj);

                        if(currentTimeTable.length === i){res.send(data);}

                    } , uncomplete => {res.send('Some errors')});

                } , unwished=>{res.send('Some errors')});
                   
            } , unallowed => {res.send("Some errors")});

        });

    } , error => {res.send('Error');});
  
}