//class schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const timeTable = new mongoose.Schema({
    classSubject_id : ObjectID,
    time : String
})

module.exports=mongoose.model('userTimeTable',new mongoose.Schema({
    user_id:    ObjectID,
    mon:[{  timeTable }],
    tue:[{  timeTable }],
    wed:[{  timeTable }],
    thr:[{  timeTable }],
    fri:[{  timeTable }],
    sat:[{  timeTable }]    
}));

