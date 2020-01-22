const express = require('express')
const router = express.Router()

const userLoginEvent = require('../models/events/user/login')
const userSignupEvent = require('../models/events/user/signup')

router.get('/' , (req,res,next) => {
    console.log('Un Avail : ' + req.url)
    next()
})

router.post('/login',userLoginEvent);
router.post('/signup',userSignupEvent);



// router.get('/login', (req,res) => {
//     res.send('hi')
// })

// router.post('/login' ,  (req,res,next) => {
//     // res.send('nothing')
//     const resData = require('../models/events/user/login')(req);
//     if(resData)
//         res.send('came to login');
//     else
//         next()
// })

// router.post('/login',userLoginEvent)
// router.use('/signup',userSignupEvent)

module.exports = router
