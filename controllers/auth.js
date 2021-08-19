const { response } = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt')


const newUser = async(req, res = response) => {

    const { name, email, password } = req.body;   

    try {

        let user = await User.findOne({email})

        if (user) {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario ya existe'
            })
        }

        const dbUser = new User(req.body);

        //Hashear contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //JWT
        const token = await generateJWT(dbUser.id, name);

        await dbUser.save();
        console.log(token);
        return res.status(201).json({
            ok:true,
            uid: dbUser.id,
            name,
            token
        })
        

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    



}

const loginUser = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no registrado'
            })
        }

        //Password match
        const validPassword = bcrypt.compareSync(password, user.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        //Generate JWT
        const token = await generateJWT(user.id, user.name);
        
        return res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            email: user.email,
            token
        })

        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const validateUser = async(req, res = response) => {

 
    const user = req.user;

    const token = await generateJWT(user.id, user.name);

    return res.status(200).json({
        ok: true,
        msg: 'Token actualizado',
        name: user.name,
        email: user.email,
        uid: user.id,
        token
    })


}

module.exports = {
    newUser,
    loginUser,
    validateUser
}


