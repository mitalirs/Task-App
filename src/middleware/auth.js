const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try{
        // 1 middleware func: 2nd arg is called (where 1st is route and 3rd is route handler)
        
        // 2 middleware func looks for header user provides
        const token = req.header('Authorization').replace('Bearer ', '') //2 args, replace 1st with 2nd
        
       
        // 3 validates that header
        const decoded = jwt.verify(token, process.env.JWT_SECRET)   
        
        // 4 finds associated user
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})   
        
        
        if(!user){
            throw new Error() 
        }

        req.user = user
        req.token = token //5 this helps route handlers to access token same as we did for user.
        
        next()  
    }catch(e){
        res.status(401). send({error: 'please authenticate'})
    }

}

module.exports = auth