import { gql } from 'apollo-server';

const typeDefs = gql`
  type Village {
    village_id: ID!
    village_name: String!
    region: String!
    land_area: String!
    latitude: Float!
    longitude: Float!
    categories: String!
    image_url: String!   # This will store the uploaded image URL
  }

  type Query {
    villages: [Village!]
    village(village_name: String!): Village
    villageById(village_id: ID!): Village
  }

  input VillageInput {
    villageName: String!
    region: String!
    landArea: String!
    latitude: Float!
    longitude: Float!
    categories: String!
    imageBase64: String!   # Expecting image URL to be passed when creating/updating
  }

  type Mutation {
    addVillage(villageData: VillageInput!): Village!
    updateVillage(villageData: VillageInput!): Village!
    deleteVillage(villageName: String!): String!
  }
`;

export default typeDefs;


