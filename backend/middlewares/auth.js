const jwt = require('jsonwebtoken');
require('dotenv').config();
function authorization(req,res,next)
{
    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).send("Unauthorized")
    try {
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
        let tempData = req.body;
        tempData.decodedData = decodedData
        req.body = tempData;

        next();
        
    } catch (error) {

        res.status(400).send("Invalid Token");
    }
}

module.exports = authorization;
