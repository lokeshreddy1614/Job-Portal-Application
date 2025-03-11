const sendEmail = require('../configs/sendGridMail.config')
const Application = require('../models/application.model')
const Job = require('../models/job.model')
const User = require('../models/user.model')

const getApplication = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id })
            .populate("jobId", "-applicants")
        res.status(200).json({ applications, user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate("userId", "name email")
            .populate("jobId")
        res.status(200).json({ applications, user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params
        const user = await User.findById(req.user._id)

        if (!user.profileId) {
            return res.status(400).json({ message: "User profile not found" })
        }

        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        if (job.applicants.includes(user.profileId)) {
            return res.status(400).json({ message: "You have already applied for this job" })
        }

        job.applicants.push(user.profileId)
        await job.save()

        const application = new Application({ userId: req.user._id, jobId })
        await application.save()

        res.status(200).json({ message: "Applied for job successfully", job, user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const updateApplicationStatus = async (req, res) => {
    try {
        const { jobId, userId, newStatus } = req.body
        const application = await Application.findOne({ userId, jobId })

        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }

        application.status = newStatus
        await application.save()

        const user = await User.findById(userId)

        await sendEmail(
            user.email,
            "Application Status Changed",
            `
            <p>Your Application Status changed to <b>${newStatus}</b></p>`
        )

        res.status(200).json({ message: "Applied status changed successfully", user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { getApplication, getAllApplications, applyForJob, updateApplicationStatus }