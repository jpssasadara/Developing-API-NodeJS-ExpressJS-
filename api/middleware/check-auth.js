const jwt = require('jsonwebtoken');

// >>>>>>>>>> passing token from body <<<<<<<<<<<<<<<<<<<<<<<<<
/*module.exports = (req, res, next) =>{
    try {
        const decoded = jwt.verify(req.body.token,process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}; */

// >>>>>>>>>> passing token from Header <<<<<<<<<<<<<<<<<<<<<<<<<
module.exports = (req, res, next) =>{
    try {                            // to split and get second part of string
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}; 
