const express = require('express')
const authRouter = express.Router()
const { signUp, logIn, resetPasswordRequest, resetPassword, verifyEmail, logout } = require('../controllers/auth.controller')
const protect = require('../middlewares/auth.middleware')

authRouter.post('/signup', signUp)
authRouter.post('/login', logIn)
authRouter.post('/logout', logout)
authRouter.post('/reset-password-request', resetPasswordRequest)
authRouter.put('/reset-password', resetPassword)
authRouter.get('/verify-email', verifyEmail)

module.exports = authRouter