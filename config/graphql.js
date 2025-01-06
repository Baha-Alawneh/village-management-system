import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema, } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import  villageTypeDefs  from '../schemas/villageSchema.js';
import  villageResolvers  from '../resolvers/villageResolvers.js';
import demographicTypeDefs from '../schemas/demographicsSchema.js';
import demographicResolvers from '../resolvers/demographicResolvers.js';
import galleryTypeDefs from '../schemas/gallerySchema.js'
import galleryResolvers from '../resolvers/galleryResolver.js'
export const createGraphQLServer = () => {
  const typeDefs = mergeTypeDefs([villageTypeDefs, demographicTypeDefs,galleryTypeDefs]);
  const resolvers = mergeResolvers([villageResolvers, demographicResolvers,galleryResolvers]);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const server = new ApolloServer({
    schema,
    playground: true,
  });

  return server;
};



