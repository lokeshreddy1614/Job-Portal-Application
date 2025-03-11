const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../configs/config")

const generateToken = (res, userId, role) => {

    try {
        const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "3d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        return token
    } catch (error) {
        console.error("Error generating token: ", error)
    }
}

module.exports = { generateToken }