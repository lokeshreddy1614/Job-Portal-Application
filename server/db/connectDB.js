const mongoose = require('mongoose')
const { MONGO_URI } = require('../configs/config')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI)
    console.log("MongoDB Connected:", conn.connection.host)
  } catch (error) {
    console.error("MongoDB Connection Failed: ", error)
    process.exit(1)
  }
}

module.exports = connectDB