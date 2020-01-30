const AttendanceLog = require('../models/attendanceLog.model');
const Response = require('../response.js');
require('dotenv').config({path: __dirname + '/../.env'})
const NEXMO_API_KEY = '019301b0'
const NEXMO_API_SECRET = '1maZVeSWIRtyXHBo'
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
  });
module.exports.addAttendance = async (req,res,next) => {
    let data = req.body;
    let attendanceLog = new AttendanceLog({
        user_id:    data.userID,
        classSubject_id : data.classSubjectID,
        time: data.time,
        student_id : data.studentID 
    });
    attendanceLog.save()
        .then(val => {
            attendanceLog.getData(val._id)
            console.log('saved')
        },reason => {
            console.log('something happend to attendance log lolololol0')
        })

    
}
module.exports.getAttendance = async (req,res) => {

}

module.exports.sendmessage=async(req,res,next) => {
    const from = FROM_NUMBER
    const to = '917338527841';
    const text = 'A text message sent using the Nexmo SMS API'
    
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
}


    
