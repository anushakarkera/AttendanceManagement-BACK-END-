const User = require('../models/user.model');
const Student = require('../models/student.model');
const Subject = require('../models/subject.model');
const Batch = require('../models/batch.model');
const subjectstudents = require('../models/studentSubject.model');
const Response=require('../response')
module.exports.Deleteuser=async(req,res,next)=>{
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

module.exports.Deletestudent=async(req,res,next)=>{
    var studentid=req.body.id;
        Student.findOneAndDelete({_id:studentid},{_id:true})
        .then(value => {
            if(!value) throw new Response(404).send(res);
            new Response(200).send(res);
            console.log("Deleted Successfully!")
        })
        .catch(err=>{
            new Response(404).send(res);
        })

}
module.exports.Addsubject=async(req,res,next)=>{
    var subject = new Subject({
            name:req.body.name
    });
    subject.save()
        .then(value => {
            new Response(201).send(res);
        },reason => {
            new Response(422).send(res);
        })
}

module.exports.RegisterStudent=async(req,res,next)=>{
    var student=new Student()
    var subs=req.body.subjects;
    console.log(subs)
    Object.assign(student,req.body)
    student.save()
    .then(value => {
        var sid=value._id
        console.log(value,sid)
        new Response(201).send(res);
        subs.forEach(async (element) => {
            console.log(element)
           const exist=await Batch.findOne({subject_id:element})
            if(exist){
                console.log(exist)
                exist.studentIDs.push(sid)
                exist.save()
                    .then(val=>{
                        console.log(val)
                        new Response(201).send(res);
                    },reason=>
                    {
                        new Response(422).send(res);
                    })

            }else{
                Subject.find({_id:element})
                .then(val=>{
                    console.log(val)
                    let batch=new Batch({
                        subject_id : element,
                        batch_name: val[0].name+" A",
                        studentIDs:sid
                    })
                    batch.save()
                    .then(val=>{
                        console.log(val)
                        new Response(201).send(res);
                    },reason=>
                    {
                        new Response(404).send(res);
                    })
                },reason=>{
                    new Response(422).send(res);
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

}