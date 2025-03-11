const multer = require('multer')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_BUCKET_NAME
} = require('../configs/config')

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
})

const storage = multer.memoryStorage()
const uploadAws = multer({ storage })

const uploadToS3 = async (fileBuffer, fileName, fileType) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `resumes/${fileName}`,
        Body: fileBuffer,
        ContentType: fileType,
        ACL: 'public-read'
    }

    await s3.send(new PutObjectCommand(params))

    return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/resumes/${fileName}`
}

module.exports = { uploadAws, uploadToS3 }