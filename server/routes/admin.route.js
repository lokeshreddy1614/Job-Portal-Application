const express = require("express")
const adminRouter = express.Router()
const protect = require("../middlewares/auth.middleware")
const { updateUserRole, getSystemAnalytics } = require("../controllers/admin.controller")

adminRouter.put("/update-role", protect(["Admin"]), updateUserRole)
adminRouter.get("/analytics", protect(["Admin"]), getSystemAnalytics)

module.exports = adminRouter