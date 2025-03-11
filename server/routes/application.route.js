const express = require('express')
const applicationRouter = express.Router()
const protect = require('../middlewares/auth.middleware')
const { getApplication, applyForJob, updateApplicationStatus, getAllApplications } = require('../controllers/application.controller')

applicationRouter.get('/', protect(["HR", "Manager", "Admin"]), getAllApplications)
applicationRouter.get('/user', protect(["User"]), getApplication)
applicationRouter.post('/:jobId/apply', protect(["User"]), applyForJob)
applicationRouter.put('/update', protect(["HR", "Manager", "Admin"]), updateApplicationStatus)

module.exports = applicationRouter