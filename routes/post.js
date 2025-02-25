const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { afterUploadImage, uploadPost, deletePost } = require('../controllers/post');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'nodebirdbuc',
        key(req, file, cb){
            cb(null, `original/${Date.now()}_${file.originalname}`);
        }
    }), 
    limits: {fileSize: 5 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

router.delete('/:postUserId/:twitId/delete', isLoggedIn, deletePost);

module.exports = router;