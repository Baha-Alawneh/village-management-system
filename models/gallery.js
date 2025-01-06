import db from "../config/db.js";

const getGallery = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery_images');
    return rows;
  } catch (error) {
    throw new Error('Failed to fetch images');
  }
};

const addImageToGallery = async (description, image_url) => {
  try {
    const [result] = await db.query('INSERT INTO gallery_images (description, image_url) VALUES (?, ?)', [description, image_url]);
    return { description, image_url };
  } catch (error) {
    throw new Error('Failed to insert image');
  }
};

export { getGallery, addImageToGallery };
