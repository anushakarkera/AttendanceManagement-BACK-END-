global.SERVER_PORT = 9999
const dbUser = 'user'
const dbPass = 'user123'
const dbName = 'test'



global.DB = {
    USER : dbUser,
    PASSWORD : dbPass,
    URL : `mongodb+srv://${dbUser}:${dbPass}@cluster0-hfbmi.mongodb.net/${dbName}?retryWrites=true&w=majority`
}

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
