import { getDemographicById,getDemographicByVillageId, getDemographics, getDemographicByName, createDemographic, updateDemographic, deleteDemographic } from "../models/demographic.js";



const resolvers = {
    Query: {
        demographics: getDemographics,
        demographicDataByName: (parent, args) => {
            return getDemographicByName(args.villageName);
        }

    },

    Mutation: {
        createDemographic: async (parent, args) => {
            
            const row = await getDemographicByVillageId(args.data.village_id);
            if (!row || row.length == 0){
               return await createDemographic(args.data)
            }
            else{
                return await updateDemographic(args.data);
            }
         },
    }
}
export default resolvers;