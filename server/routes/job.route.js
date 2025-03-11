const express = require("express")
const jobRouter = express.Router()
const protect = require("../middlewares/auth.middleware")
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require("../controllers/job.controller")

jobRouter.get("/", getAllJobs)
jobRouter.get("/:jobId", getJobById)

jobRouter.post("/add", protect(["HR", "Manager", "Admin"]), createJob)
jobRouter.put("/update/:jobId", protect(["HR", "Manager", "Admin"]), updateJob)
jobRouter.delete("/remove/:jobId", protect(["HR", "Manager", "Admin"]), deleteJob)

module.exports = jobRouter