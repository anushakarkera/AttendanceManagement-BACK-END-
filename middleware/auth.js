const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const Handler = require('../controllers/handler');
const auth = async(req, res, next) => {
    try{
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    // console.log(data);
        const user = await User.findOne({ _id: data._id, token: token });
        if (!user) {
            throw new Error();
        }
        req.user = user
        req.token = token
        next();
        return true;
    } catch (error) {
        Handler.resultHandler(401, "No Access", "Not authorized to access the resource", "error", res);
        return false;
    }

}
module.exports = auth