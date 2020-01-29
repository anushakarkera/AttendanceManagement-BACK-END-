const Student = require('../models/student.model');
const classSubject = require('../models/classSubject.model');
const mongoose = require('mongoose');

const Response = require('../response.js');
// const Mongoose = mongoose.Schema;

module.exports.list = async (req,res)=>{
    await classSubject.findOne({_id : req.query.id}).then(values => {

        var arraylist = [];
        Student.find({class_id : values.class_id})
        .then(value =>{
               res.send(value);
           },reason => {
               new Response(404).send(res);
           });        
    }, error => {
        res.send("error");
    });
}
