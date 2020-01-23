const User = require('../models/user.model')



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
    res.send('inside Signup')


}