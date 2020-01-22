const mongoose = require('mongoose')

module.exports.connectDB = () => {
    try{
        mongoose.connect( global.DB.URL , { useNewUrlParser: true ,  useUnifiedTopology: true });
        console.log('connected to DB')
    }catch(err){
        console.log(err)
    }
}