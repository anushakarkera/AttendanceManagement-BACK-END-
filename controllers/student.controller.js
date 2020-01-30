const Student = require('../models/student.model');
const Response = require('../response.js');

module.exports.list = async (req,res)=>{
    Student.find({})
        .then(values =>{
            new Response(200).setData(values).send(res);
        },reason => {
            new Response(404).send(res);
        })
}
   


    

