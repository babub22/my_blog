const jwt = require('jsonwebtoken');

module.exports.generateToken=(user:any)=>{
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    },process.env.SECRET_KEY,{expiresIn:'1h'})
}
