//class schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
module.exports=mongoose.model('attendanceLog',new mongoose.Schema({
    classSubject_id : ObjectID,
    user_id:    ObjectID,
    time: String  
}));
