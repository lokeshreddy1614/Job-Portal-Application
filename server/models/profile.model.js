const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String }, // Store AWS S3 file URL
    skills: { type: [String] },
    experience: { type: String },
    education: { type: String },
    location: { type: String }
}, { timestamps: true })

const Profile = mongoose.model("Profile", ProfileSchema)

module.exports = Profile