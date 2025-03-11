const express = require('express')
const profileRouter = express.Router()
const protect = require('../middlewares/auth.middleware')
const { updateProfile, uploadResume, addProfile, getProfiles, getProfileById, uploadResumeToAWS } = require('../controllers/profile.controller')
const { upload } = require('../middlewares/upload.middleware')
const { uploadAws } = require('../middlewares/awsUpload.middleware')

profileRouter.get('/', protect(["HR", "Manager", "Admin"]), getProfiles)
profileRouter.get('/:userId', protect(["User", "HR", "Manager", "Admin"]), getProfileById)

profileRouter.post('/add', protect(["User", "HR", "Manager", "Admin"]), addProfile)
profileRouter.put('/update', protect(["User", "HR", "Manager", "Admin"]), updateProfile)

// Stores the resume in server
profileRouter.post('/upload-resume', protect(["User"]), upload.single('resume'), uploadResume)

// Stores the resume in AWS Storage
profileRouter.post('/upload-resume', protect(["User"]), uploadAws.single('resume'), uploadResumeToAWS)

module.exports = profileRouter