require('dotenv').config()
var ClassSubject=require('./models/classSubject.model')
var cors = require('cors');
// db connectorn
require('./connection').connectDB();


//modules for express
const express = require('express')
const app = express()
app.use(cors());
const bodyParser = require('body-parser')
app.use(require('./middleware/auth'));
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

//will automatically search for index.js in './routes' folder
app.use(require('./routes'))

var listener = app.listen(process.env.SERVER_PORT, function(){
    console.log('Listening on port ' + listener.address().port)
});
async function hey(){
    var res= await ClassSubject.find({class_id
          :"5e316ea2c3c64d249c8d443e"});
          console.log(res) 
  }
  hey()