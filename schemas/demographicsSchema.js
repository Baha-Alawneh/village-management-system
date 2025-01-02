import { gql } from "apollo-server";

const typeDefs = gql`
  type demographicData {
    demographic_id: ID!
    village_id: ID!
    population_size: String!
    age_distribution: String!
    gender_ratios: String!
    population_growth_rate: String!
  }
 type Query {
  demographics: [demographicData!]
  demographicDataByName(villageName: String): demographicData
  demographicDataById(villageId: ID!): demographicData 
}
  input demographicInput {  
   village_id: ID!
    population_size: String!
    age_distribution: String!
    gender_ratios: String!
    population_growth_rate: String!
  }
  type Mutation {
    createDemographicData(data: demographicInput): String!
    updateDemographicData(data: demographicInput): String!
    deleteDemographicData(villageId: ID!): String!
  }
`;
export default typeDefs;
