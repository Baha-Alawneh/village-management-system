import db from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { v4 as uuidv4 } from 'uuid';

export const getVillages = async () => {
    const [rows] = await db.query('SELECT * FROM villages');
    if (rows.length === 0) {
        throw new NotFoundError('No villages found');
    }
    return rows;
}

export const getVillageByName = async (name) => {
    const [rows] = await db.query('SELECT * FROM villages WHERE village_name = ?', [name]);
    if (rows.length === 0) {
        throw new NotFoundError('No villages found with the given name');
    }
    return rows[0];
}

export const getVillageById = async (id) => {
    const [rows] = await db.query('SELECT * FROM villages WHERE village_id = ?', [id]);
    if (rows.length === 0) {
        throw new NotFoundError('No villages found with the given ID');
    }
    return rows[0];
}

export const addVillage = async (villageData) => {
    const id = uuidv4();
    // Make sure image_url is not empty before inserting
    if (!villageData.imageUrl) {
        throw new Error('Image URL is required');
    }

    await db.query(
        'INSERT INTO villages (village_id, village_name, region, land_area, latitude, longitude, categories, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            id,
            villageData.village_name,
            villageData.region,
            villageData.land_area,
            villageData.latitude,
            villageData.longitude,
            villageData.categories,
            villageData.imageUrl
        ]
    );

    // Fetch the newly added village
    const [newVillage] = await db.query('SELECT * FROM villages WHERE village_id = ?', [id]);

    if (!newVillage || newVillage.length === 0) {
        throw new Error('Failed to add village');
    }

    return newVillage[0];
}

export const updateVillageData = async (villageData) => {
    if (!villageData.image_url) {
        throw new Error('Image URL is required');
    }

    // Use village_id for updates for uniqueness
    await db.query(
        'UPDATE villages SET region = ?, land_area = ?, latitude = ?, longitude = ?, categories = ?, image_url = ? WHERE village_id = ?',
        [
            villageData.region,
            villageData.landArea,
            villageData.latitude,
            villageData.longitude,
            villageData.categories,
            villageData.image_url,
            villageData.villageId, // Assuming you pass village_id for updates
        ]
    );

    const [updatedVillage] = await db.query('SELECT * FROM villages WHERE village_id = ?', [villageData.villageId]);

    if (!updatedVillage || updatedVillage.length === 0) {
        throw new NotFoundError('No village found with the given ID');
    }

    return updatedVillage[0];
}

export const deleteVillageByName = async (name) => {
    const [villageToDelete] = await db.query('SELECT * FROM villages WHERE village_name = ?', [name]);
    if (!villageToDelete.length) {
        throw new Error('Village not found');
    }
    await db.query('DELETE FROM villages WHERE village_name = ?', [name]);
    return "Deleted successfully";
}
