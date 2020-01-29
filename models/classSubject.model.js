//class schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
module.exports=mongoose.model('classsubjects',new mongoose.Schema({
    class_id : ObjectID,
    subject_id : ObjectID
}));
