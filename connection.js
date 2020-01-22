const mongoose = require('mongoose')
const url = 'mongodb+srv://user:user123@cluster0-hfbmi.mongodb.net/test?retryWrites=true&w=majority'

module.exports.connectDB = () => {
    try{
        mongoose.connect( url , { useNewUrlParser: true ,  useUnifiedTopology: true });
        console.log('connected to DB')
    }catch(err){
        console.log(err)
    }
}