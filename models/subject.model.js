//class schema
const mongoose = require('mongoose');
module.exports=mongoose.model('subject',new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String
}));
