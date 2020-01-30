const AttendanceLog = require('../models/attendanceLog.model');
const Response = require('../response.js');
const AbsentLog=require('../models/absentLog.model')
const NEXMO_API_KEY = '019301b0';
const NEXMO_API_SECRET ='1maZVeSWIRtyXHBo';
const Nexmo = require('nexmo');
const from = 'Nexmo';
const text = 'Student is absent'
const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
  })

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
            //absentLog.insertMany(abData)
            abData.forEach(element => {
                console.log(element)
                absentLog=new AbsentLog(element)
                absentLog.save()
                .then( value => {
                    new Response(200).send(res);   
                }, reason => {
                    new Response(409).send(res);
                })
                nexmo.message.sendSms(from, to, text, (err, responseData) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if(responseData.messages[0]['status'] === "0") {
                            console.log("Message sent successfully.");
                        } else {
                            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        }
                    }
                })
                
        })
            console.log('saved')
        },reason => {
            console.log('something happend to attendance log lolololol0')
        })
    
}
module.exports.getAttendance = async (req,res) => {

}
module.exports.sendMessage=async(req,res) =>{
    
}
   
/*module.exports.sendMessage = async (req,res) => {
    
    
    nexmo.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}*/

    
