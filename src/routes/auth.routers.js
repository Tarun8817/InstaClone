const express = require('express');
const authController = require('../controllers/auth.controller')
const authRouter = express.Router()


/**
 * POST /api/auth/register
*/

/**
 * POST api/auth/login
*/

authRouter.post('/register', authController.registerController)
authRouter.post('/login', authController.loginController)

module.exports = authRouter

