const express = require('express')
const router = express.Router()

const userController = require('./user.controller')

router.use('/user',userController)

router.get('/' , (req,res,next) => {
    console.log('Un Avail : ' + req.url)
    next()
})

module.exports = router
