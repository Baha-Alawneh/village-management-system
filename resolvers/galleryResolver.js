// resolvers.js
import fs from 'fs';
import path  from'path';
import { addImageToGallery,getGallery } from "../models/gallery.js";

const resolvers = {
  Query: {
    
    // Resolver for getAllImages query
    getAllImages: getGallery,
},

Mutation: {
  addImage: async (_, { galleryData,}) => {
    try {
      const {description, imageBase64} = galleryData;

        // Decode Base64 image
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const imageName = `${description.slice(0,5).replace(/\s+/g, '_')}_${Date.now()}.jpg`;
        const imagePath = path.join(process.cwd(), 'uploads', imageName);
        console.log(buffer);

        // Save image to the uploads directory
        fs.writeFileSync(imagePath, buffer);

        // Save village data and image URL in the database
        const imageUrl = `http://localhost:4000/uploads/${imageName}`;
      const newImage = await addImageToGallery(description, imageUrl);
      return newImage;
    } catch (error) {
      console.error(error);

      throw new Error('Failed to add image');
    }
  },
},
};

export default resolvers;
