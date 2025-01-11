import { gql } from "apollo-server";

const typeDefs = gql`
type User {
  user_id: ID!
  username: String!
  full_name: String!
  password: String!
  role: String!
}

input SignupInput {
  full_name: String!
  username: String!
  password: String!
}

input loginInput {
  username: String!
  password: String!
}

type loginResponse {
  token: String!
}

type Query {
  userById(id: String!): User
  admins: [User!]
  users: [User!]
}

type Mutation {
  signup(input: SignupInput): String!
  login(input: loginInput): loginResponse!
  logout(token: String):String
}
`;

export default typeDefs;
