//class schema
const mongoose = require('mongoose');
module.exports=mongoose.model('class',new mongoose.Schema({
    name : String,
    roomNumber : Number
}));
