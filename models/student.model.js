//student schema
const mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({

    fullname: {
        type: String
    },
    gender: {
        type: String
       
    },
    email: {
        type: String,
        unique: true
     },
    phone: {
        type: String
        
    }
    
})
module.exports=mongoose.model('Student',studentSchema);
