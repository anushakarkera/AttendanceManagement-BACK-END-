//class schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
module.exports=mongoose.model('attendanceLog',new mongoose.Schema({
   _id: ObjectID,
    batch_id : ObjectID,
    user_id :    ObjectID,
    studentIDs:[]
}));
