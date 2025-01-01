import express from 'express';
import dotenv from 'dotenv'
import  {createGraphQLServer} from './config/graphql.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


const graphqlServer = createGraphQLServer();
await graphqlServer.start();
graphqlServer.applyMiddleware({ app });
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
