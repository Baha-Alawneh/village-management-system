import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Village {
    village_id: ID!
    village_name: String!
    region: String!
    land_area: String!
    latitude: Float!     # Changed from Number to Float
    longitude: Float!    # Changed from Number to Float
    categories: String!
    image_url: String!
  }

  type Query {
    villages: [Village!]
    village(village_name: String!): Village
  }

  input VillageInput {     # Corrected input type name
    villageName: String!
    region: String!
    landArea: String!
    latitude: Float!
    longitude: Float!
    categories: String!
    image_url: String!
  }

  type Mutation {
    addVillage(villageData: VillageInput!): Village!
    updateVillage(villageData: VillageInput!): Village!
    deleteVillage(villageName: String!): String!
  }
`;
