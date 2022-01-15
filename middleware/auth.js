const jwt = require('jsonwebtoken');
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        return (
            res.status(401).json({ 
                msg: 'No token, Authorization denied!',
                success: false
            })
        );
    }
    try {
        const bearer = token.split(' ')[1];
        jwt.verify(bearer, process.env.JWT_SECRET, (error, decoded) => {
            if(error){
                return res.status(401).json({
                    msg: 'Token is not valid',
                    success: false
                })
            }else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Sever Error',
            success: false
        })
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(
                `User role ${req.user.role} is not authorized to access this route`, 403)
            )
        }
        next();
    }
}

module.exports = {
    auth,
    authorize
};