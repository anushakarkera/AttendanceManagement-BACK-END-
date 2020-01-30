const AttendanceLog = require('../models/attendanceLog.model');
const Response = require('../response.js');
const AbsentLog=require('../models/absentLog.model')

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
        })
            console.log('saved')
        },reason => {
            console.log('something happend to attendance log lolololol0')
        })
        /*var ids=req.body.id
        User.find({_id:{$in:ids}},function(err, result) {
            if (err) throw err;
            console.log(result);
            console.log(result._id)
            var absentStudents=new Student()
            Object.assign(absentStudents, result._id)
            console.log(result._id)
            absentStudents.save()
            .then( value => {
            new Response(201).send(res);   
        }, reason => {
            new Response(409).send(res);
        })*/
    
}
module.exports.getAttendance = async (req,res) => {

}
   


    