require('dotenv').config();
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

AWS.config.getCredentials(err => {
    if (err) console.log(err.stack);
    else {      
        const s3 = new AWS.S3({
            accessKeyId: AWS.config.credentials.accessKeyId, 
            secretAccessKey: AWS.config.credentials.secretAccessKey
        });  
        exports.AWS_S3 = (req, res) => {
            const key = `chatForClassAvatars/${req.query.userId}/${uuid()}.jpeg`;

            s3.getSignedUrl('putObject', {
                Bucket: process.env.S3_BUCKET, 
                ContentType: 'image/jpeg', 
                Key: key
            }, (err, preSignedUrl) => {
                res.json(preSignedUrl);
            });
        }
    }
});
