import { google } from 'googleapis';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
};

const oauth2Client = new OAuth2Client(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uri
);

export async function uploadFile(filePath, mimeType) {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const fileMetadata = {
    name: 'uploaded-image.jpg', // Customize the name or pass it dynamically
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const fileUrl = `https://drive.google.com/uc?id=${file.data.id}`;
  return fileUrl;
}
