const  mongoose = require('mongoose');
const Student = require('../models/student.model')


module.exports.student = async (req,res)=>{
var b = await Student.find({});
if(b)
        res.send(b);
else 
    {
        var errr ={};
        errr.code=404
        errr.status='Not found';
        errr.message='Students details not found';
        res.send(errr);

    }      
}
   


    