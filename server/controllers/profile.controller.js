const { uploadToS3 } = require("../middlewares/awsUpload.middleware")
const Profile = require("../models/profile.model")
const User = require("../models/user.model")

const getProfiles = async (req, res) => {
    try {
        const candidates = await Profile.find().populate("userId", "name email role")
        res.json({ candidates, user: req.user })
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
}

const getProfileById = async (req, res) => {
    try {
        const { userId } = req.params

        const candidate = await Profile.findOne({ userId: userId === "undefined" ? req.user._id : userId })
            .populate("userId", "name email role")
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" })
        }

        res.status(200).json({ candidate, user: req.user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

const addProfile = async (req, res) => {
    try {
        const { skills, experience, education, location } = req.body

        const userId = req.user._id

        const existingProfile = await Profile.findOne({ userId })
        if (existingProfile) {
            return res.status(404).json({ message: "Profile already exists" })
        }

        const profile = new Profile({ userId, skills, experience, education, location })
        await profile.save()

        const user = await User.findById(userId).select("-password")
        user.profileId = profile._id
        user.save()

        res.status(201).json({ message: "Profile created successfully", profile, user: user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { skills, experience, education, location } = req.body

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            { $set: { skills, experience, education, location } },
            { new: true }
        )
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }

        res.status(200).json({ message: "Profile updated successfully", profile, user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const uploadResumeToAWS = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Invalid file type. Only PDF files are allowed." });
        }

        const fileBuffer = req.file.buffer
        const fileName = `${Date.now()}_${req.file.originalname}`
        const fileType = req.file.mimetype

        const fileUrl = await uploadToS3(fileBuffer, fileName, fileType)

        const profile = await Profile.findOne({ userId: req.user._id })
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }

        profile.resume = fileUrl
        await profile.save()

        res.json({ message: "Resume uploaded successfully", resumeUrl: fileUrl })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const profile = await Profile.findOne({ userId: req.user._id })
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }

        const filePath = `/uploads/${req.user._id}.pdf` // Construct file path

        profile.resume = filePath
        await profile.save()

        res.json({ success: true, message: "Resume uploaded successfully", filePath, user: req.user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


module.exports = { getProfiles, getProfileById, addProfile, updateProfile, uploadResume, uploadResumeToAWS }