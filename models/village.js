import db from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { v4 as uuidv4 } from 'uuid';

export const getVillages = async () => {
    const [rows] = await db.query('SELECT * FROM villages');
    if (rows.length == 0) {
        throw new NotFoundError('No villages found');
    }
    return rows;
}

export const getVillageByName = async (name) => {
    const [rows] = await db.query('SELECT * FROM villages WHERE village_name = ?', [name]);
    if (rows.length == 0) {
        throw new NotFoundError('No villages found with the given name');
    }
    return rows[0];
}

export const addVillage = async (villageData) => {
    const id = uuidv4();
    await db.query(
        'INSERT INTO villages (village_id, village_name, region, land_area, latitude, longitude, categories, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            id,
            villageData.villageName,
            villageData.region,
            villageData.landArea,
            villageData.latitude,
            villageData.longitude,
            villageData.categories,
            villageData.image_url
        ]
    );
    const [newVillage] = await db.query('SELECT * FROM villages WHERE village_id = ?', [id]);
    if (!newVillage || newVillage.length == 0)
        throw new Error('Failed to add village');

    return newVillage[0];
}

export const updateVillageData = async (villageData) => {
    await db.query(
        'UPDATE villages SET region = ?, land_area = ?, latitude = ?, longitude = ?, categories = ?, image_url = ? WHERE village_name = ?',
        [
            villageData.region,
            villageData.landArea,
            villageData.latitude,
            villageData.longitude,
            villageData.categories,
            villageData.image_url,
            villageData.villageName,
        ]
    );
    const [updatedVillage] = await db.query('SELECT * FROM villages WHERE village_name = ?', [villageData.villageName]);
    if (!updatedVillage || updatedVillage.length === 0)
        throw new NotFoundError('No villages found with the given name');

    return updatedVillage[0];

}

export const deleteVillageByName = async (name) => {
    const [villageToDelete] = await db.query('SELECT * FROM villages WHERE village_name = ?', [name]);
    if (!villageToDelete.length) {
        throw new Error('Village not found');
    }
    await db.query('DELETE FROM villages WHERE village_name = ?', [name]);
    return "deleted successfully";
}