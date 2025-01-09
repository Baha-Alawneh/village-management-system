import { gql } from "apollo-server";




const typeDefs = gql`
  type Query {
    chat(user: String!,admin: String!):String
  }
`;


export default typeDefs;