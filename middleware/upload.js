// backend/middleware/upload.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig');
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `village-images/${req.body.village_name}-${Date.now()}-${file.originalname}`);
    }
  })
});

module.exports = upload;
