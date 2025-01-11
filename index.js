import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { createGraphQLServer } from './config/graphql.js';
import { wss } from './config/socket.js';
dotenv.config();
const app = express();
const port =  4000;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a GraphQL server
const graphqlServer = createGraphQLServer();
await graphqlServer.start();
graphqlServer.applyMiddleware({ app });

// API endpoint for image upload(this is just for images, we have used graphql for all core features )
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Construct the image URL 
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl: imageUrl });
});

// Serve static files from the 'uploads' directory (this is api is jus for images uploading)
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


