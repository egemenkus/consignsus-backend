const jwt = require("jsonwebtoken");
require("dotenv").config()


const verifyToken = (req,res,next) =>{
    const token = req.body.token || req.query.token || req.headers['x-access-token']
    
    if(!token) {
        return res.status(403).send({"status":"TOKEN_REQUIRED","msg":"A token is required"})
    }
    try {
        const decoded = jwt.verify(token, `${process.env.API_SECRET}`)
        req.user = decoded
    } catch(error) {
        return res.status(401).send(error)
    }
    return next()
}
module.exports = verifyToken