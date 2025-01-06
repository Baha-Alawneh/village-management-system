import { gql } from "apollo-server";


const typeDefs = gql`
type User {
    user_id: ID!
    username: String!
    email: String!
    password: String!
    role: String!
}
    input SignupInput {
    full_name: String!
    username:String!
    password:String!
    }
    input loginInput {
      username: String!
      password: String!
}
      type loginResponse {
      token: String!
      }
      type Mutation {
      signup(input: SignupInput): String!
      login(input: loginInput): loginResponse!
      }
`

export default typeDefs;