//student schema
const mongoose = require('mongoose');

module.exports=mongoose.model('Student',new mongoose.Schema({
    fullname: String,
    gender  : String,
    email   : { type: String,   unique: true    },
    phone   : String,
    class_id : mongoose.Schema.Types.ObjectId
}));

