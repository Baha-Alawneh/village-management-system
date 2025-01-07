import express from 'express';
import dotenv from 'dotenv'
import  {createGraphQLServer} from './config/graphql.js';
import { wss } from './config/socket.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const graphqlServer = createGraphQLServer();
await graphqlServer.start();
graphqlServer.applyMiddleware({ app });
const server=app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


