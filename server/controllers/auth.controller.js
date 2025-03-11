const User = require('../models/user.model')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/generateToken')
const sendEmail = require('../configs/sendGridMail.config')
const { NODE_ENV, CLIENT_URL } = require('../configs/config')

const client_url = NODE_ENV === "development" ? "http://localhost:3000" : CLIENT_URL

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body

        let { role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(404).json({ message: "User already exists" })
        }

        const admin = await User.find()

        if (admin.length === 0) {
            role = "Admin"
        }

        const user = new User({ name, email, password, role })

        const verificationToken = crypto.randomBytes(20).toString('hex')
        user.emailVerificationToken = verificationToken
        await user.save()

        const verificationUrl = `${client_url}/auth/verify-email?token=${verificationToken}`

        await sendEmail(
            user.email,
            "Verify Your Email",
            `
            <p>Verify your email for further process.</p>
            <p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
        )

        res.status(201).json({ message: "User registered successfully. Check your email to verify." })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        generateToken(res, user._id, user.role)

        res.status(200).json({
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" })
        console.log(error)
    }
}

const logout = async (req, res) => {
    await res.clearCookie("token")
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const resetToken = crypto.randomBytes(20).toString('hex')
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()

        const resetUrl = `${client_url}/auth/reset-password?token=${resetToken}`
        await sendEmail(
            user.email,
            "Password Reset Request",
            `<p>Link expires in 1 hour</p>
            <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        )

        res.status(200).json({ message: "Password reset email sent" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        user.password = newPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        const appUrl = `${client_url}/auth/login`
        await sendEmail(
            user.email,
            "Password Reset Successful",
            `<p>Your password has reset successfully</p>
            <p>Click <a href="${appUrl}">here</a> to view the home page.</p>`
        )

        res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query

        const user = await User.findOne({ emailVerificationToken: token })
        if (!user) {
            return res.status(400).json({ message: "Invalid token" })
        }

        user.isEmailVerified = true
        user.emailVerificationToken = undefined
        await user.save()

        res.status(200).json({ message: "Email verified successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { signUp, logIn, resetPasswordRequest, resetPassword, verifyEmail, logout }