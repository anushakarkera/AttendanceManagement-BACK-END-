require('dotenv').config()

// db connectorn
require('./connection').connectDB();


//modules for express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

//will automatically search for index.js in './routes' folder
app.use(require('./routes'))

var listener = app.listen(process.env.SERVER_PORT, function(){
    console.log('Listening on port ' + listener.address().port)
});
