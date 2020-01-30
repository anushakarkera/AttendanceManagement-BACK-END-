const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserTT = require('../models/userTimeTable.model');
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
            console.log(retrievedValue)
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
            console.log(err)
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


module.exports.timeTable = async (req,res) => {
    await UserTT.findOne({user_id : req.query.user_id}).then(result => {
        const today  = new Date().getDay();
        var weekDay = ['sun','mon','tue','wed','thr','fri','sat'];
        //console.log(weekDay[today]);
        const currentTimeTable = result[weekDay[today]];
        //console.log(currentTimeTable);
    }, error => {
        res.send('Error');
    });
}