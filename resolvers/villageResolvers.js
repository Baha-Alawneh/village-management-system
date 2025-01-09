import { getVillages, getVillageByName, addVillage, updateVillageData, deleteVillageByName } from '../models/village.js';
import fs from 'fs';
import path  from'path';
const resolvers = {
    Query: {
        villages: getVillages,

        // Fetch village by name
        village: async (parent, args) => {
            const result = await getVillageByName(args.village_name);
            return result;
        },

        // Fetch village by ID
        villageById: async (parent, args) => {
            const result = await getVillageById(args.village_id); // Fixed args key to match the query
            return result;
        },
    },

    Mutation: {
        // Add new village with image URL handling
        addVillage: async (parent, args) => {
            // Assuming `args.villageData.imageUrl` is the URL of the uploaded image
            const { villageName, region, landArea, latitude, longitude, categories, imageBase64 } = args.villageData;
            
            
            // Decode Base64 image
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const imageName = `${villageName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
            const imagePath = path.join(process.cwd(), 'uploads', imageName);
            console.log(buffer);

            // Save image to the uploads directory
            fs.writeFileSync(imagePath, buffer);

            // Save village data and image URL in the database
            const imageUrl = `http://localhost:4000/uploads/${imageName}`;


            // You may want to store the image URL in your database after it has been uploaded
            const newVillage = {
                village_name: villageName,
                region,
                land_area: landArea,
                latitude,
                longitude,
                categories,
                imageUrl: imageUrl,  // Make sure the URL is stored here
            };
            console.log(newVillage);

            // Add the new village to your database
            const result = await addVillage(newVillage);
            return result;
        },

        // Update an existing village with new image URL
        updateVillage: async (parent, args) => {
            const { villageName, region, landArea, latitude, longitude, categories, imageBase64 } = args.villageData;
            console.log(villageName);
            let imageUrl=null;
            if(imageBase64 != "") {
        
                // Decode Base64 image
                const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const imageName = `${villageName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
                const imagePath = path.join(process.cwd(), 'uploads', imageName);
                console.log(buffer);

                // Save image to the uploads directory
                fs.writeFileSync(imagePath, buffer);

                // Save village data and image URL in the database
                 imageUrl = `http://localhost:4000/uploads/${imageName}`;
            }
            // Prepare the updated village data
            const updatedVillage = {
                village_name: villageName,
                region,
                land_area: landArea,
                latitude,
                longitude,
                categories,
                image_url: imageUrl,  // Update image URL as well
            };

            // Update the village in the database
            const result = await updateVillageData(updatedVillage);
            return result;
        },

        // Delete a village by its name
        deleteVillage: async (parent, args) => {
        console.log(args);
        const result= await deleteVillageByName(args.villageName);
        return result;
        },
    },
};

export default resolvers;
