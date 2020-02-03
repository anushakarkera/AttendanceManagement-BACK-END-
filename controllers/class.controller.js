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

module.exports.addAttendance = async (req,res,next) => {
    let data = req.body;
    let attendanceLog = new AttendanceLog({
        user_id:    req.userID,
        classSubject_id : data.classSubjectID,
        time: data.time,
    });
    attendanceLog.save()
        .then(val => {
            let abData = [];
            data.studentIDs.forEach(element => {
                abData.push({
                    attendanceLog_id : val._id,
                    student_id : element
                })
            });
            console.log(abData)
            let absentLog
            ClassSubject.find({_id:data.classSubjectID},function(err,result){
                if (err) throw new Response(404).send(res);
                Subject.find({_id:result[0].subject_id},function(err,result){
                    if (err) throw new Response(404).send(res);
                    var sub_name=result[0].name
                    abData.forEach(element => {
                        absentLog=new AbsentLog(element)
                        absentLog.save()
                        .then( value => {
                            new Response(200).send(res);   
                        }, reason => {
                            new Response(409).send(res);
                        })
                        Student.find({_id:element.student_id},{phone:true,fullName:true},function(err, result) {
                            if (err) throw err;
                            var to=result[0].phone;
                            const text = result[0].fullName+' is absent today for '+ sub_name+' class which is at '+data.time+' !'
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
                    })  
                })   
            })
            },reason => {
                new Response(422).send(res); 
            })
    
}
module.exports.getAttendance = async (req,res) => {
}

    
