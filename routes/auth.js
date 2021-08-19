const { Router } = require('express');
const { check } = require('express-validator');
const { newUser, loginUser, validateUser } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'No es un correo válido').isEmail(),
    check('password', 'La constraseña es obligatoria').not().isEmpty(),
    validateFields
], newUser)

router.post('/', [
    check('email', 'No es un correo válido').isEmail(),
    check('password', 'La constraseña es obligatoria').not().isEmpty(),
    validateFields
], loginUser)

router.get('/renew', validateJWT, validateUser)


module.exports = router



