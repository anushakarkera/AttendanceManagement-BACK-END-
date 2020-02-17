const Book = require('../models/book.model');
const Department=require('../models/department.model');
const departmentBooks=require('../models/departmentbooks.model')
const Response = require('../response');
const mongoose = require('mongoose');
module.exports.addBooks = (req, res, next) => {
    var book = new Book();
    Object.assign(book, req.body);
    book.save()
        .then(value => {
            new Response(200).send(res);
        }
        )
        .catch (err => {
                if(err.name==='ValidationError')
                 new Response(400).setError('Required Field Missing').send(res)
                else    
                 new Response(422).send(res);
        
        })
}
module.exports.addDepartment=(req,res,next)=>{
    var department=new Department();
    Object.assign(department,req.body);
    department.save()
    .then(value=>{
        new Response(200).send(res)
    })
    .catch(err =>{
        new Response(422).send(res);
    })
}
module.exports.booksInDepartment=(req,res,next)=>{
    let data=req.body;
    departmentBooks.findOneAndUpdate({department_id:data.department_id},{$push:{book_ids:data.book_ids}},{new:true,upsert:true})
    .then(val=>{
        new Response(200).send(res)
    })
    .catch(err=>{
        new Response(404).send(res);
    })
}
module.exports.deleteBooks=(req,res,next)=>{
    let id=req.body.id
    Book.findOneAndDelete({_id:id})
    .then(val=>{
        if(!val) throw new Response(404).send(res);
        new Response(200).send(res)
    })
    .catch(err=>{
        new Response(404).send(res);
    })
}


module.exports.getDepartments= async(req,res,next)=>{
    const departments= await departmentBooks.find();
    if(departments){
        new Response(200).setData(departments).send(res)
    }else
    new Response(404).setError("No Departments Exist").send(res)
}

module.exports.getBooks= async(req,res,next)=>{
    const books= await departmentBooks.findOne({department_id:req.body.departmentID},{book_ids:true,_id:false})
    if(books){
        new Response(200).setData(books).send(res)
    }else
    new Response(404).setError("Department Doesn't Exist").send(res)
}