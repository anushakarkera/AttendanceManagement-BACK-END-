const Book = require('../models/book.model');
const Department=require('../models/department.model');
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
    
}
