const User = require('../models/user.model');
const UserTimeTable = require('../models/userTimeTable.model')
const mongoose = require('mongoose');
const Student = require('../models/newStudent.model');
const Subject = require('../models/subject.model');
const Batch = require('../models/batch.model');
const subjectstudents = require('../models/studentSubject.model');
const Response=require('../response')
var crypto = require('crypto');
const getTimeStamp = (date) => {return Math.floor(date.getTime() / 1000).toString(16)}
const AttendanceLog = require('../models/newAttendanceLog.model');
const NEXMO_API_KEY = '019301b0';
const NEXMO_API_SECRET ='1maZVeSWIRtyXHBo';
const Nexmo = require('nexmo');
const from = 'Nexmo';
const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
  })

module.exports.deleteUser=async(req,res,next)=>{
    var userid=req.body.id;
        User.findOneAndDelete({_id:userid})
            .then(value => {
                if(!value) throw new Response(404).send(res);
                new Response(200).send(res);
                console.log("Deleted Successfully!")
            })
            .catch(err=>{
                new Response(404).send(res);
            })

}
module.exports.deleteStudent=async(req,res,next)=>{
   const studentid=req.body.id;
        Student.findOneAndDelete({_id:studentid},{_id:true})
        .then(value => {
            if(!value) throw new Response(404).send(res);
            new Response(200).send(res);
            console.log("Deleted Successfully!")
        },reason=>{
            new Response(404).send(res);
})
}


module.exports.addSubject=async(req,res,next)=>{
    var subject = new Subject({
        name: req.body.name
    });
    subject.save()
        .then(value => {
            new Response(201).send(res);
        }, reason => {
            new Response(422).send(res);
        })
}

module.exports.deleteSubject=async(req,res,next)=>{
    const subjectid=req.body.id;
         Subject.findOneAndDelete({_id:subjectid},{_id:true})
         .then(value => {
              if(!value) throw new Response(404).send(res);
            console.log("Deleted Successfully!") 
            new Response(200).send(res);
             
         },reason=>{new Response(404).send(res);})
             
 }

module.exports.registerStudent=async(req,res,next)=>{
    var fees=0
    var newbatch=false
    var student=new Student()
    var subs=req.body.subjects;
    Object.assign(student,req.body)
    student.save()
    .then(value => {
        subs.forEach(async (element) => {
            const exist=await Batch.findOne({subject_id:element}).sort({_id:-1})  //if the batch already exists
            if(exist){
                if(exist.studentIDs.length<2){ //check for the number of students in the batch. if exceeding, create new batch of the same subject and ask for the price, if not , push the student id to batch
                    exist.studentIDs.push(value._id)
                    Save(exist,value._id,exist.batch_name.slice(0,exist.batch_name.length-2))
                }else{
                    newbatch=true
                    Subject.find({_id:element})
                    .then(val=>{
                        let batch=new Batch({
                        subject_id : element,
                        batch_name: val[0].name+" "+String.fromCharCode((exist.batch_name.charCodeAt(exist.batch_name.length-1))+1), //to get alphabets
                        studentIDs:value._id,
                        price:req.body.price
                        })
                        
                        console.log(batch.price.default)
                        Save(batch,value._id,val[0].name)
                        Object.assign(student)
                    })
                }
            }else{
                newbatch=true // so front end should show the message for admin about the price whether to increase or not .
                Subject.find({_id:element})
                .then(val=>{
                        let batch=new Batch({
                        subject_id : element,
                        batch_name: val[0].name+" A",
                        studentIDs:value._id,
                        price:req.body.price
                    })
                    
                    Save(batch,value._id,val[0].name)
                    
                })
            }
        })
    })
    .catch (err => {
        if(err.name==='ValidationError')
            new Response(400).setError('Required Field Missing').send(res)
        else    
            new Response(409).send(res);
    
    });

    function Save(collection,sid,sub){
        collection.save()
        .then(val=>{
            console.log(val)
            fees=fees+val.price
            subjectstudents.findOneAndUpdate({student_id:sid},{$push:{subjects:{subject:sub,batch_name:val.batch_name}},fees:fees},{new:true,upsert:true})
            .then(val=>{
                new Response(200).send(res);
            },reason=>
            {
                new Response(422).send(res);
            })
        },reason=>
        {
            new Response(404).send(res);
        })
    }
}

//to view the fees details of the student 
module.exports.view=async(req,res,next)=>{
        var studentid=req.body.studentid
        subjectstudents.find({student_id:studentid})
        .then(val=>{
            console.log(val)
            var data={}
            data.details=val[0].subjects
            data.totalFees=val[0].fees
            new Response(200).setData(data).send(res)
        },reason=>
        {
            new Response(404).send(res);
        })


}

module.exports.assignTimeTable = async (req, res, next) => {
    try{
    const isUserExisting = await User.findOne({ _id: req.body.user_id })
    if (isUserExisting) {
        const updatedTimeTable = await UserTimeTable.findOneAndUpdate({ user_id: req.body.user_id }, req.body, { new: true, upsert: true });
        if (updatedTimeTable) new Response(200).setData(updatedTimeTable).send(res)
    }
    else {
        new Response(404).setError("User Not Found").send(res)
    }
}catch(error){
    new Response(422).send(res)
}
}

module.exports.getStudentDetails= async (req,res,next)=>{
    try{
    const studentDetails=await Student.findOne({_id:req.body.studentID},{_id:false,class_id:false})
    if(studentDetails)
    new Response(200).setData(studentDetails).send(res)
    else
    new Response(404).setError('Student not Found')
    }
    catch(error){
        new Response(422).send(res)
    }
}

module.exports.getAttendance = async (req,res) => {
    try {
            var absent = await AttendanceLog.findOne({_id:req.body.attendanceLogID,user_id:req.userID},{studentIDs:true,batch_id:true});
            const studentids = await Batch.find({_id:absent.batch_id},{studentIDs:true,_id:false});
            const students =await Student.find({_id:{"$in":studentids[0].studentIDs}},{fullName:true})
            console.log(students)
            let ab ={};
            absent.studentIDs.forEach(ele =>{
                ab[ele] = true;
            })
            console.log(ab)
            let resData =[]
            students.forEach(ele =>{
                console.log(ele)
                resData.push({
                    studentName : ele.fullName,
                    absent : ab[ele._id]?true:false
                })
            })
            new Response(200).setData(resData).send(res);
        }
    catch(err) {
        new Response(404).send(res);
     }

    }

    module.exports.addAttendance = async (req,res,next) => {
        let data = req.body;
        let attendanceLog = new AttendanceLog({
            _id: getTimeStamp(new Date(req.body.date))+crypto.randomBytes(8).toString("hex"),
            user_id:    req.userID,
            batch_id : data.batchID,
            studentIDs : data.studentIDs
            
        });
         var studentIDs = data.studentIDs
         console.log(studentIDs,req.userID)
        attendanceLog.save()
            .then(val => {
                console.log(val)
                Batch.find({_id:data.batchID},function(err,result){
                    if (err) throw new Response(404).send(res);
                    Subject.find({_id:result[0].subject_id},function(err,result){
                        if (err) throw new Response(404).send(res);
                        var sub_name=result[0].name;
                        Student.find({"_id":{"$in":studentIDs}},{phone:true,fullName:true})
                            .then(val=>{
                                new Response(200).send(res)
                                sms(val,sub_name)
                            })
                    })
                })   
        },reason => {
            new Response(422).send(res); 
        })
    }
    function sms(val,sub_name){
       val.forEach(element=>{
        var to=element.phone;
        const text = element.fullName+' is absent today for '+ sub_name
        nexmo.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
                console.log(err);
            }else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    })
    }

    module.exports.list = async (req,res)=>{
        await Batch.findOne({_id : req.body.batchID},{studentIDs:true,_id:false}).then(values => {
            Student.find({_id:{"$in":values.studentIDs}})
            .then(value =>{
                    var list = [];
                   (value.forEach(element => { list.push({
                    "studentID":element._id,
                    "name":element.fullName
                    }) }));
                   new Response(200).setData(list).send(res);
               }).catch(reason => {
                   new Response(404).send(res);
               });        
        }).catch(error => {
            new Response(404).setData('Student list not found for the class').send(res);
        });
    }