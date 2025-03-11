const User = require("../models/user.model")
const Profile = require("../models/profile.model")
const Application = require("../models/application.model")
const sendEmail = require("../configs/sendGridMail.config")

const updateUserRole = async (req, res) => {
    try {
        const { email, newRole } = req.body

        const allowedRoles = ["User", "HR", "Manager", "Admin"]
        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" })
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: newRole },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await sendEmail(
            user.email,
            "Application Status Changed",
            `
            <p>Your role has changed to <b>${newRole}</b></p>`
        )

        res.status(200).json({
            message: "User role updated successfully",
            admin: req.user
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const getSystemAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const profiles = await Profile.find().populate("userId", "-password")
        const totalApplications = await Application.countDocuments()

        const totalCandidates = profiles.filter(profile => profile.userId.role === "User").length

        const users = await User.find().select("-password")

        res.status(200).json({ totalUsers, totalCandidates, totalApplications, users, admin: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { updateUserRole, getSystemAnalytics }