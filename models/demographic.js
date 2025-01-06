import db from "../config/db.js";
import { AlreadyExistsError, NotFoundError } from "../utils/errors.js";
import { v4 as uuid } from 'uuid';
import { getVillageByName } from "./village.js";


export const getDemographics = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM demographics'); // Await the result of the query
        if (!rows || rows.length === 0) {
            throw new NotFoundError("No demographics found");
        }
        return rows; // Ensure an array is returned
    } catch (error) {
        console.error("Error fetching demographics:", error.message);
        throw new Error("Failed to fetch demographics");
    }
};


export const getDemographicById = async(id) => {
    const [row] =await db.query('SELECT * FROM demographics WHERE demographic_id =?', [id]);
    if (!row || row.length == 0)
        throw new NotFoundError("No demographic found with the given ID");

    return row[0];
}


export const getDemographicByName =async (name) => {
    const [rows] =await db.query('SELECT * FROM demographics join villages ON demographics.village_id = villages.village_id  WHERE villages.village_name = ?', [name]);
    if (rows.length == 0 || !rows)
        throw new NotFoundError("No demographic found with the given name");

    return rows[0];
}

export const createDemographic = async (data) => {
    const demographic = await getDemographicByName(data.village_name);
    if(demographic.length >0) {
        throw new AlreadyExistsError("Demographic already exists");
    }
    const demographic_id = uuid();
    await db.query('INSERT INTO demographics values (?,?,?,?,?,?)', [demographic_id,
         data.village_id, 
         data.population_size, 
         data.age_distribution, 
         data.gender_ratios, 
         data.population_growth_rate]);
         
         return "added successfully";
}

export const updateDemographic = async (data) => {
    const demographic = await getDemographicById(data.demographic_id);
    if(!demographic) {
        throw new AlreadyExistsError("Demographic not found");
    }
    await db.query('UPDATE demographics SET population_size=?, age_distribution=?, gender_ratios=?, population_growth_rate=? WHERE demographic_id=?', [
        data.population_size,
        data.age_distribution,
        data.gender_ratios,
        data.population_growth_rate,
        data.demographic_id
    ]);
    return "updated successfully";
}

export const deleteDemographic = async (id) => {
    const demographic = await getDemographicById(id);
    if(!demographic) {
        throw new AlreadyExistsError("Demographic not found");
    }
    await db.query('DELETE FROM demographics WHERE demographic_id=?', [id]);
    return "deleted successfully";
}
