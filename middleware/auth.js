const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,next)=>{
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('access denied');
    try{
     const userdecode =  jwt.verify(token,config.get('jwtkey'));
     req.user = userdecode;
     next();
    }catch(err){
        res.status(400).send('invalid token');
    }
}