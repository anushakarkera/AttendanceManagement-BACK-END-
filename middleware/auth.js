const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const handler = require('../controllers/handler');
const auth = async(req, res, next) => {
    try {
        
        if(req.url === '/user/login' || req.url === '/user/signup' || req.url === '/user/forgotpassword' || req.url === '/user/newpassword'){
            next();
            return true;
        }
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(req.header('Authorization'))
    const data = jwt.verify(token, process.env.JWT_KEY);
    console.log(data);
        const user = await User.findOne({ _id: data._id, token: token });
        if (!user) {
            throw new Error();
        }
        req.userID= user._id;
        req.user = user;
        req.token = token;
        next();
        return true;
    } catch (error) {
        //res.status(401).send({ error: 'Not authorized to access this resource' })
        //console.log('hello');
        handler.resultHandler(401,'Error','Not authorized to access this resource','error',res);
    }

}
module.exports = auth;