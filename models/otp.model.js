//otp schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
module.exports=mongoose.model('otp',new mongoose.Schema({
    user_id :{type: ObjectID,unique:true},
    otp : String
}));
