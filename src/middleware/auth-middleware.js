const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) {
        return res.status(401).json({
            success:false, message: 'Access Denied'
        });
    }
    try {   
        const decode = jwt.verify(token, 'secret');
        req.user = decode;
        next();
    }catch(error) {
        return res.status(401).json({
            success:false, message: 'Invalid Token'
        })
    }
}

function isAdmin(req, res, next) {
    if(req.user && req.user.isAdmin) {
        next();
    }else {
        return res.status(403).json({
            success: false,
            message: 'User do not have access, please contact admin'
        })
    }
}
function isSuperAdmin(req, res, next) {
    if(req.user && req.user.isSuperAdmin) {
        next();
    }else {
        return res.status(403).json({
            success: false,
            message: 'User do not have access, please contact admin'
        })
    }
}
module.exports = {isAdmin, verifyToken, isSuperAdmin}