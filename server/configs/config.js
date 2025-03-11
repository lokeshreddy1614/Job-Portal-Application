const dotenv = require('dotenv')

dotenv.config()

exports.JWT_SECRET = process.env.JWT_SECRET
exports.MONGO_URI = process.env.MONGO_URI
exports.PORT = process.env.PORT
exports.NODE_ENV = process.env.NODE_ENV
exports.CLIENT_URL = process.env.CLIENT_URL
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
exports.AWS_REGION = process.env.AWS_REGION
exports.AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
exports.SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL