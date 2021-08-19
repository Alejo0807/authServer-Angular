const { response } = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateJWT = async(req, res = response, next) => {

    const token = req.header('x-token');
    
    if (!token) {
        return res.status(400).json({
            msg: 'No hay token en la petición'
        });
    }
    

    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

    //console.log(token)
    // next();
}


module.exports = {
    validateJWT
};
