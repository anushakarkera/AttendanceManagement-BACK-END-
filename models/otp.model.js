//otp schema
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
let otpSchema = new mongoose.Schema({
    user_id :{type: ObjectID,unique:true},
    otp : String,
    expireAt: {type:Date,
        default:Date.now()
    }  
},{timestamps:true});

otpSchema.index({expireAt:1},{expireAfterSeconds:60})
//{createdAt:{type:Date,expires:'30s',default:Date.now}
module.exports=mongoose.model('otp',otpSchema);

