// backend/middleware/upload.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig');

// Configure multer for file upload to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', // Make the file publicly accessible
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Use the village name and timestamp for the file name
      cb(null, `village-images/${req.body.village_name}-${Date.now()}-${file.originalname}`);
    }
  })
});

module.exports = upload;
