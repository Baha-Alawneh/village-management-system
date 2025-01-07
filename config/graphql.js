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

import galleryTypeDefs from '../schemas/gallerySchema.js'
import galleryResolvers from '../resolvers/galleryResolver.js'
export const createGraphQLServer = () => {
  const typeDefs = mergeTypeDefs([villageTypeDefs, demographicTypeDefs,galleryTypeDefs,authTypeDefs]);
  const resolvers = mergeResolvers([villageResolvers, demographicResolvers,galleryResolvers,authResolvers]);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const server = new ApolloServer({
    schema,
    playground: true,
  //   context: ({ req }) => {
  //     const isAuthFreeOperation = ['signup', 'login'].includes(operationName);
  //     const user = authenticateToken(req, isAuthFreeOperation); 
  //     return { user };
  //   },
  }
  );

  return server;
};




