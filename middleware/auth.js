const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const handler = require('../controllers/handler')
//require('dotenv').config();
const auth = async(req, res, next) => {
    if(req.url === '/user/login' || req.url === '/user/signup' || req.url === '/user/forgotpassword' || req.url === '/user/newpassword'){
        next();
        return true;
    }
    else
    {
    try {    
    const token = req.header('Authorization').replace('Bearer ', '');
    //console.log(req.header('Authorization'))
    //console.log(process.env.JWT_KEY)
    const data = jwt.verify(token, process.env.JWT_KEY);
    //console.log(data);
        const user = await User.findOne({ _id: data._id, token: token });
        if (!user) {
            //console.log('yes')
            throw new Error();
        }
        req.userID= user._id;
        req.user = user;
        req.token = token;
        next();
        return true;
    } catch (error) {
        //Comment: Please find forgotpassword API url in user routes
        if(req.url === '/user/login' || req.url === '/user/signup' || req.url === '/user/forgotPassword' || req.url === '/user/newPassword'){
            next();
            // return true;
        }else{
            handler.resultHandler(401,'Error','Not authorized to access this resource','error',res)
        }
        
    }
}
module.exports = auth