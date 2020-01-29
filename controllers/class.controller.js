const AttendanceLog = require('../models/attendanceLog.model');
const Response = require('../response.js');

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
   


    