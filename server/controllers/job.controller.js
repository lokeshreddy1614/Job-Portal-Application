const Job = require("../models/job.model")

const createJob = async (req, res) => {
    try {
        const { title, description, qualifications, experience, location, jobType } = req.body

        if (!title || !description || !qualifications || !experience || !location || !jobType) {
            return res.status(400).json({ message: "All required fields must be filled" })
        }

        const newJob = new Job({
            title,
            description,
            qualifications,
            experience,
            location,
            jobType,
            postedBy: req.user._id,
        })

        await newJob.save()
        res.status(201).json({ message: "Job created successfully", job: newJob, user: req.user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("postedBy", "name email")
            .populate({
                path: 'applicants',
                select: "skills experience education resume location",
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })
        res.status(200).json({ jobs })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params
        const job = await Job.findById(jobId)
            .populate("postedBy", "name email -_id")
            .populate({
                path: 'applicants',
                select: "skills experience education resume location -_id",
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })

        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        res.status(200).json({ job })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params
        const { title, description, qualifications, experience, location, jobType, status } = req.body

        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        job.title = title || job.title
        job.description = description || job.description
        job.qualifications = qualifications || job.qualifications
        job.experience = experience || job.experience
        job.location = location || job.location
        job.jobType = jobType || job.jobType
        job.status = status || job.status

        await job.save()
        res.status(200).json({ message: "Job updated successfully", job, user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }

        await job.deleteOne()
        res.status(200).json({ message: "Job deleted successfully", user: req.user })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
}