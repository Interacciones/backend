const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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

module.exports = { uploadFile };
