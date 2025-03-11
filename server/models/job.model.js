const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: [String], required: true },
    qualifications: { type: [String], required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // HR/Manager/Admin
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }], // Candidate profiles
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
