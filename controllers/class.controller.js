const AttendanceLog = require('../models/attendanceLog.model');
const Response = require('../response.js');
const AbsentLog=require('../models/absentLog.model')
const NEXMO_API_KEY = '019301b0';
const NEXMO_API_SECRET ='1maZVeSWIRtyXHBo';
const Nexmo = require('nexmo');
const from = 'Nexmo';
const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
  })
const Student = require('../models/student.model');
const ClassSubject=require('../models/classSubject.model')
const Subject=require('../models/subject.model')
const Batch=require('../models/batch.model')
var crypto = require('crypto');
const getTimeStamp = (date) => {return Math.floor(date.getTime() / 1000).toString(16)}

module.exports.addAttendance = async (req,res,next) => {
    let data = req.body;
    let attendanceLog = new AttendanceLog({
        _id: getTimeStamp(new Date(req.body.date))+crypto.randomBytes(8).toString("hex"),
        user_id:    req.userID,
        batch_id : data.batchID,
        studentIDs : data.studentIDs
        
    });
     var studentIDs = data.studentIDs
     console.log(studentIDs)
    attendanceLog.save()
        .then(val => {
            Batch.find({_id:data.batchID},function(err,result){
                if (err) throw new Response(404).send(res);
                Subject.find({_id:result[0].subject_id},function(err,result){
                    if (err) throw new Response(404).send(res);
                    var sub_name=result[0].name;
                    Student.find({"_id":{"$in":studentIDs}},{phone:true,fullName:true})
                        .then(val=>{
                            new Response(200).send(res)
                            sms(val,sub_name)
                        })
                })
            })   
    },reason => {
        new Response(422).send(res); 
    })
}
function sms(val,sub_name){
    val.forEach(element=>{
        var to=element.phone;
        const text = element.fullName+' is absent today for '+ sub_name
        nexmo.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
                console.log(err);
            }else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    })
}
module.exports.getAttendance = async (req,res) => {
    try {
            var absent = await AttendanceLog.findOne({_id:req.body.attendanceLogID,user_id:req.userID},{studentIDs:true,batch_id:true});
            const batchID = await Batch.findOne({_id:absent.batch_id},{_id:true});
            const students = await Student.find({batch_id:batchID._id},{fullName:true});
            let ab ={};
            absent.studentIDs.forEach(ele =>{
                ab[ele] = true;
            })
            let resData =[]
            students.forEach(ele =>{
                resData.push({
                    studentName : ele.fullName,
                    absent : ab[ele._id]?true:false
                })
            })
            new Response(200).setData(resData).send(res);
        }
    catch(err) {
        new Response(404).send(res);
     }

    }
    
