global.port = 9999

//db connection
require('./connection').connectDB()

//modules for express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')



app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

//will automatically search for index.js in './routes' folder
app.use(require('./routes'))

app.listen(global.port , ()  =>  {
    console.log('Server Running...')
})
