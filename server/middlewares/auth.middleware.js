const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../configs/config')
const User = require('../models/user.model')

const protect = (roles) => async (req, res, next) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ message: "Access Denied" })

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Forbidden" })
        }
        req.user = await User.findById(decoded.userId).select("-password").populate("profileId")
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" })
    }
}

module.exports = protect