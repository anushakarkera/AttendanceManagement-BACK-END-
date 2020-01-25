const  mongoose = require('mongoose');
const Student = require('../models/student.model')

const Handler = require('./handler');

module.exports.student = async (req,res)=>{
var b = await Student.find({});
if(b){
        Handler.resultHandler(200, "OK", "Student Details Found", b, res);   
        //res.send(b);
}
else 
    {
        Handler.resultHandler(404, "Not Found", "Student Details Not Found", "error", res);
        // var errr={};
        // errr.code=404
        // errr.status='Not found';
        // errr.message='Students details not found';
        // res.send(errr);

    }      
}
   


    