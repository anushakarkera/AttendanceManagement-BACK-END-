const User = require('../models/user.model');
const UserTimeTable = require('../models/userTimeTable.model')
const mongoose = require('mongoose');
const Student = require('../models/student.model');
const Subject = require('../models/subject.model');
const Batch = require('../models/batch.model');
const subjectstudents = require('../models/studentSubject.model');
const Book = require('../models/book.model')
const Response = require('../response')
const newBook= require('../models/newBook.model')
const FillBooks=require('../models/fillBooks.model')
module.exports.deleteUser = async (req, res, next) => {
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
module.exports.deleteStudent = async (req, res, next) => {
    const studentid = req.body.id;
    Student.findOneAndDelete({ _id: studentid }, { _id: true })
        .then(value => {
            new Response(200).send(res);
            console.log("Deleted Successfully!")
        })
    new Response(404).send(res);
}


module.exports.addSubject = async (req, res, next) => {
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

module.exports.registerStudent = async (req, res, next) => {
    var fees = 0
    var student = new Student()
    var subs = req.body.subjects;
    Object.assign(student, req.body)
    student.save()
        .then(value => {
            subs.forEach(async (element) => {
                const exist = await Batch.findOne({ subject_id: element }).sort({ _id: -1 })  //if the batch already exists
                if (exist) {
                    if (exist.studentIDs.length < 2) { //check for the number of students in the batch. if exceeding, create new batch of the same subject and ask for the price, if not , push the student id to batch
                        exist.studentIDs.push(value._id)
                        Save(exist, value._id, exist.batch_name.slice(0, exist.batch_name.length - 2))
                    } else {
                        Subject.find({ _id: element }) //setDefaultsOnInsert:true
                            .then(val => {
                                let batch = new Batch({
                                    subject_id: element,
                                    batch_name: val[0].name + " " + String.fromCharCode((exist.batch_name.charCodeAt(exist.batch_name.length - 1)) + 1), //to get alphabets
                                    studentIDs: value._id,
                                    price: req.body.price
                                })

                                Save(batch, value._id, val[0].name)
                            })
                    }
                } else {
                    Subject.find({ _id: element })
                        .then(val => {
                            let batch = new Batch({
                                subject_id: element,
                                batch_name: val[0].name + " A",
                                studentIDs: value._id,
                                price: req.body.price
                            })
                            Save(batch, value._id, val[0].name)

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

    function Save(collection, sid, sub) {
        collection.save()
            .then(val => {
                console.log(val)
                fees = fees + val.price
                subjectstudents.findOneAndUpdate({ student_id: sid }, { $push: { subjects: { subject: sub, batch_name: val.batch_name } }, fees: fees }, { new: true, upsert: true })
                    .then(val => {
                        new Response(200).send(res);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }, reason => {
                new Response(404).send(res);
            })
    }
}

//to view the fees details of the student 
module.exports.view = async (req, res, next) => {
    var studentid = req.body.studentid
    subjectstudents.find({ student_id: studentid })
        .then(val => {
            console.log(val)
            var data = {}
            data.details = val[0].subjects
            data.totalFees = val[0].fees
            new Response(200).setData(data).send(res)
        }, reason => {
            new Response(404).send(res);
        })
}

module.exports.assignTimeTable = async (req, res, next) => {
    try {
        const isUserExisting = await User.findOne({ _id: req.body.user_id })
        if (isUserExisting) {
            const updatedTimeTable = await UserTimeTable.findOneAndUpdate({ user_id: req.body.user_id }, req.body, { new: true, upsert: true });
            if (updatedTimeTable) new Response(200).setData(updatedTimeTable).send(res)
        }
        else {
            new Response(404).setError("User Not Found").send(res)
        }
    }
    catch (error) {
        new Response(422).send(res)
    }
}

module.exports.getStudentDetails = async (req, res, next) => {
    try {
        const studentDetails = await Student.findOne({ _id: req.body.studentID }, { _id: false, class_id: false })
        if (studentDetails)
            new Response(200).setData(studentDetails).send(res)
        else {
            new Response(404).setError('Student not Found').send(res)
        }
    }
    catch (error) {
        new Response(422).send(res)
    }
}

module.exports.refillRequests = async (req, res, next) => {
    try {
        const refill = await FillBooks.find({}, { __v: false })
        const newBooks = await newBook.find({}, { __v: false })
        if (refill.length != 0 || newBooks.length != 0) {
            const booksToBeBought = {
                old:[],
                newOne:[]
            }


            refill.forEach(async element => {
                if (element.delivered === false) {
                    booksToBeBought.old.push(element)
                    const updated = await FillBooks.findOneAndUpdate({ _id: element._id }, { delivered: true })
                    
                   // console.log(booksToBeBought)
                }
            })
            newBooks.forEach(async element1 => {
                if (element1.delivered === false) {
                    booksToBeBought.newOne.push(element1)
                    const hey = await newBook.findOneAndUpdate({ _id: element1._id }, { delivered: true }, { __v: false })
                    
                    //console.log(booksToBeBought)
                }
            })
            //console.log(booksToBeBought)
            if (booksToBeBought.old.length == 0 && booksToBeBought.new.length == 0) {
                new Response(400).setError('No new Requests').send(res)
            } else {
                new Response(200).setData(booksToBeBought).send(res)
            }
        } else
            new Response(400).setError('No new Requests').send(res)
    } catch (error) {
        new Response(404).send(res)
    }

}

