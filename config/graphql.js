import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema, } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import  villageTypeDefs  from '../schemas/villageSchema.js';
import  villageResolvers  from '../resolvers/villageResolvers.js';
import demographicTypeDefs from '../schemas/demographicsSchema.js';
import demographicResolvers from '../resolvers/demographicResolvers.js';

export const createGraphQLServer = () => {
  const typeDefs = mergeTypeDefs([villageTypeDefs, demographicTypeDefs]);
  const resolvers = mergeResolvers([villageResolvers, demographicResolvers]);
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



