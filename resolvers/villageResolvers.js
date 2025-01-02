import { getVillages,getVillageByName, addVillage,updateVillageData, deleteVillageByName } from '../models/village.js';

const resolvers = {
    Query: {
        villages: getVillages,
        village:async(parent,args) => {
            const result = await getVillageByName(args.village_name);
            return result;
        },
    },
    Mutation: {
        addVillage: async (parent, args) => {
           const result= addVillage(args.villageData);
           return result;
        },
        updateVillage: async (parent, args) => {
           const result = await updateVillageData(args.villageData);
           return result;
        },
        deleteVillage: async (parent, args) => {
        const result= deleteVillageByName(args.villageName);
        return result;
        },
    },
};
export default  resolvers;