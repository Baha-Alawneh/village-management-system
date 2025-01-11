import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema, } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import  villageTypeDefs  from '../schemas/villageSchema.js';
import  villageResolvers  from '../resolvers/villageResolvers.js';
import demographicTypeDefs from '../schemas/demographicsSchema.js';
import demographicResolvers from '../resolvers/demographicResolvers.js';
import authTypeDefs from '../schemas/authSchema.js';
import authResolvers from '../resolvers/authResolvers.js';
import authenticateToken from "../middleware/authenticate.js";
import galleryTypeDefs from '../schemas/gallerySchema.js';
import galleryResolvers from '../resolvers/galleryResolver.js';
import chatTypeDefs from '../schemas/chat.js';
import chatResolvers from '../resolvers/chatResolver.js';
export const createGraphQLServer = () => {
  const typeDefs = mergeTypeDefs([villageTypeDefs, demographicTypeDefs,galleryTypeDefs,authTypeDefs,chatTypeDefs]);
  const resolvers = mergeResolvers([villageResolvers, demographicResolvers,galleryResolvers,authResolvers,chatResolvers]);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const server = new ApolloServer({
    schema,
    playground: true,
    context: async ({ req }) => {
      const isAuthFreeOperation = ['signup', 'login'].includes(req.body.operationName);
      try {
        const user = await authenticateToken(req, isAuthFreeOperation);
        return { user }; 
      } catch (err) {
        throw new Error(err.message);
      }
    },
  });

  return server;
};




