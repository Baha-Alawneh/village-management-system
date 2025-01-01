import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../schemas/villageSchema.js';
import { resolvers } from '../resolvers/villageResolvers.js';

export const createGraphQLServer = () => {
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


