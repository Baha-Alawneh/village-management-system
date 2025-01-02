import { getDemographicById,getDemographics,getDemographicByName,createDemographic,updateDemographic,deleteDemographic } from "../models/demographic.js";



const resolvers = {
    Query :{
        demographics:  getDemographics,
        demographicDataByName:(parent,args) => {
           return getDemographicByName(args.villageName);
        }
       
    
    }

}

export default resolvers;