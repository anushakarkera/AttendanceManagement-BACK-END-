const User = require('../models/user.model');

const Handler = require('./handler');

module.exports.login = async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return Handler.resultHandler(401, "Error", "Username is wrong!!! Login Failed.", "error", res);//res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await user.generateAuthToken();

        var doc = { ok : true , _id : user._id, token : token };
        Handler.resultHandler(200, "OK", "Successful Login", doc, res);//res.status(200).json({ok:true,_id:user.id,token:token});
    } catch (error) {
        Handler.resultHandler(400, "Error", "Login Failed!!! Username or Password is Incorrect.", "error", res);//res.status(400).send(error);
    }

}

module.exports.signup = (req,res,next) =>{
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.phone = req.body.phone;
    user.gender = req.body.gender;
    user.city = req.body.city;
    user.save((err, doc) => {
        if (!err) {
            Handler.resultHandler(200, "OK", "Successfully Registered", doc, res);
            // var result = {};
            
            // result.responseCode = 200;
            // result.status = "OK";
            // result.message = "Successfully registered"
            // result.data = doc;
            //res.send(result);

        }
        
        else
        {
            if(err.code === 11000){
            
                Handler.resultHandler(409, "CONFLICT", "Duplicate Email", "error", res);
            //  var error = {};
            //  error.code = 409;
            //  error.status = 'conflict';
            //  error.message = 'duplicate email';
            //   res.send(error);
            }
            else
                return next(err);
        }
    });
}