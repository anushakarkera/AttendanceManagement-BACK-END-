// const express = require('express')
// const router = express.Router;
// router.post('/' ,    (req,res,next) =>{
//     res.send('login');
//     next();
// })
module.exports = (req,res,next) =>{
    console.log(req.body);
    res.send('made to login')

    //login code here...


}