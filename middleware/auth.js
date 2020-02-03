const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const handler = require('../controllers/handler')
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: data._id, token: token });
        if (!user) {
            console.log('yes')
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