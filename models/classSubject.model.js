//class schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
module.exports=mongoose.model('classSubject',new mongoose.Schema({
    class_id : ObjectID,
    subject_id : ObjectID
}));

