//class schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

let attendanceLog = new mongoose.Schema({
    user_id:    ObjectID,
    classSubject_id : String,
    time: String  ,
    student_id : [String]
})
attendanceLog.statics.getData = (_id) => {
    attendanceLog.findOne({_id:_id})
        .then(val => {
            console.log(val)
            console.log('lol');
        },reason => {
            console.log('reason lol')
        })
}
attendanceLog.post('save' , () => {
    //retreive student's parent number and send sms
    console.log('attendance log saved');
})
module.exports=mongoose.model('attendanceLog',attendanceLog);