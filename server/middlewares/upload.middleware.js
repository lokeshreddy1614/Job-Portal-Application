const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../public/uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        if (!req.user || !req.user._id) {
            return cb(new Error("User ID not found in request"), null)
        }

        const userId = req.user._id.toString()
        const fileExtension = path.extname(file.originalname)
        const filePath = path.join(uploadDir, `${userId}${fileExtension}`)

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        cb(null, `${userId}${fileExtension}`)
    }
})

const upload = multer({ storage })


module.exports = { upload }
