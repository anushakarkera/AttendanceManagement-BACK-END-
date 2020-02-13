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
module.exports.adddepartment=(req,res,next)=>{
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
module.exports.booksindepartment=(req,res,next)=>{
    let data=req.body;
    departmentBooks.findOneAndUpdate({department_id:data.department_id},{$push:{book_ids:data.book_ids}},{new:true,upsert:true})
    .then(val=>{
        new Response(200).send(res)
    })
    .catch(err=>{
        new Response(404).send(res);
    })
}
module.exports.deletebooks=(req,res,next)=>{
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
