const User = require('../models/user.model');
const UserTimeTable = require('../models/userTimeTable.model')
const mongoose = require('mongoose');
const Student = require('../models/student.model');
const Subject = require('../models/subject.model');
const Batch = require('../models/batch.model');
const subjectstudents = require('../models/studentSubject.model');
const Response = require('../response')
module.exports.Deleteuser = async (req, res, next) => {
    var userid = req.body.id;
    User.findOneAndDelete({ _id: userid })
        .then(value => {
            if (!value) throw new Response(404).send(res);
            new Response(200).send(res);
            console.log("Deleted Successfully!")
        })
        .catch(err => {
            new Response(404).send(res);
        })

}

module.exports.Deletestudent = async (req, res, next) => {
    var studentid = req.body.id;
    Student.findOneAndDelete({ _id: studentid }, { _id: true })
        .then(value => {
            if (!value) throw new Response(404).send(res);
            new Response(200).send(res);
            console.log("Deleted Successfully!")
        })
        .catch(err => {
            new Response(404).send(res);
        })

}
module.exports.Addsubject = async (req, res, next) => {
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

module.exports.RegisterStudent = async (req, res, next) => {
    var student = new Student()
    var subs = req.body.subjects;
    Object.assign(student, req.body)
    student.save()
        .then(value => {
            subs.forEach(async (element) => {
                const exist = await Batch.findOne({ subject_id: element }).sort({ _id: -1 })
                console.log(exist)
                if (exist) {
                    if (exist.studentIDs.length < 10) {
                        exist.studentIDs.push(value._id)
                        Save(exist, value._id)
                    } else {
                        Subject.find({ _id: element }) //setDefaultsOnInsert:true
                            .then(val => {
                                let batch = new Batch({
                                    subject_id: element,
                                    batch_name: val[0].name + " " + String.fromCharCode((exist.batch_name.charCodeAt(exist.batch_name.length - 1)) + 1), //to get alphabets
                                    studentIDs: value._id
                                })
                                Save(batch, value._id)
                            })
                    }
                } else {
                    Subject.find({ _id: element })
                        .then(val => {
                            let batch = new Batch({
                                subject_id: element,
                                batch_name: val[0].name + " A",
                                studentIDs: value._id
                            })
                            Save(batch, value._id)

                        })
                }
            })
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                new Response(400).setError('Required Field Missing').send(res)
            else
                new Response(409).send(res);

        });



    function Save(collection, sid) {
        console.log(sid)
        collection.save()
            .then(val => {
                console.log(val)
                subjectstudents.findOneAndUpdate({ student_id: sid }, { $push: { subjects: { subject_id: val.subject_id, batch_name: val.batch_name } } }, { new: true, upsert: true })
                    .then(val => {
                        console.log(val + "yaaay")
                        var response = { "details": val.subjects }
                        new Response(200).send(response)
                    })
                    .catch(err => {
                        console.log(err)
                    })

                new Response(201).send(res);
            }, reason => {
                new Response(404).send(res);
            })
    }
}

module.exports.assignTimeTable = async (req, res, next) => {
    const isUserExisting = await User.findOne({ _id: req.body.user_id })
    if (isUserExisting) {
        const updatedTimeTable = await UserTimeTable.findOneAndUpdate({ user_id: req.body.user_id }, req.body, { new: true, upsert: true });
        if (updatedTimeTable) new Response(200).setData(updatedTimeTable).send(res)
    }
    else {
        new Response(404).setError("User Not Found").send(res)
    }
}

