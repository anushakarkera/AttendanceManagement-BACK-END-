const mongoose = require('mongoose')
//fixex all deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//Register schema to models here



module.exports.connectDB = () => {
    mongoose.connect( process.env.DB_URL,(err) =>{
        if(err){
            console.log('Not Connected to DB')
            throw err
        }else{
            console.log('Connected to DB')
        }
    });
}