global.SERVER_PORT = 9999
global.DB_URL = 'mongodb+srv://user:user123@cluster0-hfbmi.mongodb.net/test?retryWrites=true&w=majority'

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

app.listen(global.PORT , ()  =>  {
    console.log('Server Running...')
})
