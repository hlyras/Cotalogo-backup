const fs = require("fs");
const aws = require("aws-sdk");

const s3 = new aws.S3({ endpoint: process.env.S3_ENDPOINT });

async function uploadFileS3(path, fileName) {
  let data = await fs.promises.readFile(path);

  const uploadParams = {
    Bucket: process.env.BUCKET_PATH,
    Body: data,
    'ACL': 'public-read',
    'ContentType': 'image/png',
    Key: fileName
  };

  return s3.upload(uploadParams).promise();
};

async function deleteFileS3(keycode) {
  let deleteParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: keycode
  };

  return s3.deleteObject(deleteParams).promise();
};

module.exports = {
  uploadFileS3,
  deleteFileS3
};