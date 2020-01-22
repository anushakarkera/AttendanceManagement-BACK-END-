const express = require('express')
const router = express.Router()

const userRouter = require('./user.router')
router.use('/user',userRouter)

module.exports = router


//future
// const classRouter = require('./class.router')
// const studentRouter = require('./student.router')
// router.use('/class',classRouter)
// router.use('/student',studentRouter)




