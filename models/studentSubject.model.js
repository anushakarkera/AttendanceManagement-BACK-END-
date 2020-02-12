const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
module.exports=mongoose.model('studentSubject',new mongoose.Schema({
    student_id : ObjectID,
    subjects : [
                {
                    subject_name: String,
                    batch_name:String
                }
            ],
    fees:Number

}));