const express = require('express');
const router = express.Router();

const userRouter = require('./user.router');
router.use('/user',userRouter);

const studentRouter = require('./student.router');
router.use('/student',studentRouter);

const classRouter = require('./class.router');
router.use('/class',classRouter);

module.exports = router;







