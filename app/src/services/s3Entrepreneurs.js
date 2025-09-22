const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const uploadFile = async (name, file) => {
  try {
    const fileStream = fs.createReadStream(file.filepath);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME_ENTREPRENEURS,
      Key: name,
      ContentType: "image/jpeg",
      ContentDisposition: "inline",
      Body: fileStream,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME_ENTREPRENEURS}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${name}`;
    return fileUrl;
  } catch (err) {
    console.error("Error uploading file", err);
    throw err;
  }
};

const deleteFile = async (fileUrl) => {
  try {
    // Extract the S3 key from the full URL
    // URL format: https://bucket.s3.region.amazonaws.com/key
    const bucketName = process.env.AWS_BUCKET_NAME_ENTREPRENEURS;
    const region = process.env.AWS_BUCKET_REGION;
    const expectedPrefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
    
    if (!fileUrl.startsWith(expectedPrefix)) {
      console.warn(`File URL doesn't match expected S3 format: ${fileUrl}`);
      return false;
    }
    
    const key = fileUrl.replace(expectedPrefix, '');
    
    if (!key) {
      console.warn(`Could not extract S3 key from URL: ${fileUrl}`);
      return false;
    }

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    
    console.log(`✅ Successfully deleted S3 file: ${key}`);
    return true;
  } catch (err) {
    console.error(`❌ Error deleting S3 file: ${fileUrl}`, err);
    return false;
  }
};

module.exports = { uploadFile, deleteFile };
