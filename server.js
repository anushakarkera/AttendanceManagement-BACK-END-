const app = require('express')()
const router = require('express').Router()
const GLOBAL = require('./GLOBAL')
// const ROUTER = GLOBAL.ROUTER
const userRouter = require('./models/user/entryRoute')
app.post('/user',userRouter);
