import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/awsConfig.js';

export const uploadImageToS3 = async (bucketName, key, fileContent) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key, // File name in the bucket
      Body: fileContent, // File content (Buffer or Stream)
    };

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    console.log('File uploaded successfully:', response);
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Rethrow to handle in the calling function
  }
};

