const AWS = require('aws-sdk');

const uploadToS3 = async (data, filename) => {
    const BUCKET_NAME = 'expensetrackerapprky';
    const IAM_USER_KEY = 'AKIAQ3EGUZZTXVG34VYN';
    const IAM_USER_SECRET = '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';
  
    let s3Bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY, 
      secretAccessKey: IAM_USER_SECRET,
    });
  
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    }
    return new Promise((res, rej) => {
      s3Bucket.upload(params, (err, s3response) => {
        if(err) {
          console.log('S3 Error:', err);
          rej();
        } else {
          console.log('S3 success:', s3response);
          res(s3response.Location);
        }
      });
    });
    // s3Bucket.createBucket( () => {
    //   var params = {
    //     Bucket: BUCKET_NAME,
    //     Key: filename,
    //     Body: data
    //   }
    //   s3Bucket.upload(params, (err, s3response) => {
    //     if(err) {
    //       console.log('S3 Error:', err);
    //     } else {
    //       console.log('S3 success:', s3response);
    //     }
    //   })
    // })
  }
module.exports = {
    uploadToS3
}