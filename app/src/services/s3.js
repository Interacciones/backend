const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from a .env file
dotenv.config();

// Initialize the AWS SDK with the credentials from the environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

// Define the S3 upload function
const uploadFile = async (name, file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: name,
    ContentType: 'image/jpeg',
    ContentDisposition: 'inline',
    Body: fs.createReadStream(file.filepath),
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error uploading file", err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

module.exports = { uploadFile };
