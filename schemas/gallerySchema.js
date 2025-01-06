import { gql } from "apollo-server";

const typeDefs = gql`

type Image {
    description: String!
    image_url: String!
  }


type Query {
  getAllImages: [Image!]!
  }

  input galleryInput{
    description: String!
    imageBase64: String!
  }
  
type Mutation {
  addImage(galleryData: galleryInput!): Image!
}
`;

export default typeDefs;
