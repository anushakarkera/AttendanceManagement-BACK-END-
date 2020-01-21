const dbUserName = 'user'
const dbUserPass = 'user123'
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb+srv://'+dbUserName+':'+dbUserPass+'@cluster0-hfbmi.mongodb.net/test?retryWrites=true&w=majority'
let _db




const userDir = './user'
const userEntryRoute = userDir + '/entryRoute'
const userLogin = userDir + '/login'
const userSignup = userDir + '/signup'


const router = {
    USER : {
        MAIN_ROUTE  :   userEntryRoute,
        LOGIN       :   userLogin,
        SIGNUP      :   userSignup
    }
}

module.exports = {
    DB :{
        USER_NAME : dbUserName,
        USER_PASSWORD : dbUserPass,
        URL : 'mongodb+srv://'+dbUserName+':'+dbUserPass+'@cluster0-hfbmi.mongodb.net/test?retryWrites=true&w=majority'
    },
    ROUTER: router
}


// async  function getdb (){

// }
// const connectDB = async () => {
//     try {
//         MongoClient.connect(uri, (err, db) => {
//             _db = db
//             console.log('Connected')
//             return callback(err)
//         })
//     } catch (e) {
//         throw e
//     }
// }

// const getDB = () => _db

// // const disconnectDB = () => _db.close()

// module.exports = { connectDB, getDB }



// const url = 
