const AttendanceLog = require('../models/attendanceLog.model');
const Response = require('../response.js');
const AbsentLog=require('../models/absentLog.model')
const Student = require('../models/student.model');

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
                Student.find({_id:element.student_id},{phone:true},function(err, result) {
                    if (err) throw err;
                    let to=result[0].phone;
                });
        })
            console.log('saved')
        },reason => {
            console.log('something happend to attendance log lolololol0')
        })
    
}
module.exports.getAttendance = async (req,res) => {

}
   


    
