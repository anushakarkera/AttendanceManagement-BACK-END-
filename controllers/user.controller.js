const User = require('mongoose').model('User')
const jwt = require('jsonwebtoken')



module.exports.login = async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        //console.log(token);
        res.status(200).json({ok:true,_id:user.id,token:token});
        //res.send(a);
    } catch (error) {
        res.status(400).send(error)
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
            var result = {}
            
            result.responseCode = 200;
            result.status = "OK";
            result.message = "Successfully registered"
            result.data = doc;

            res.send(result);

        }
        
        else
        {
            if(err.code === 11000){
             var error = {};
             error.code = 409;
             error.status = 'conflict';
             error.message = 'duplicate email';
              res.send(error);
            }
            else
                return next(err);
        }
    });
}

module.exports.profile= (req,res,next)=>{
    //extract payload
    const token = req.header('Authorization').replace('Bearer ', '')
    //retrieve data
    const data = jwt.verify(token, process.env.JWT_KEY)
            try {
                //query the database
             User.findOne({ _id:data._id, 'tokens.token': token },(error,user)=>{
            if (error) {
                throw new Error()
            }
            //sending response according to the schema in user.model.js 
            res.status(200).send({fullName:user.fullName,email:user.email,gender:user.gender,city:user.city});
            next()});
          
        } catch (error) {
            res.status(404).send({ error: 'Details not found' });
           
        }
    }
    

