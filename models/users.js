import db from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { v4 as uuidv4 } from 'uuid';



export const getUserByName=(name)=> {
    const user = db.query("SELECT * FROM users WHERE username = ?", name);
    if(!user||user.length==0)
        throw new NotFoundError("User not found");
    return user[0];
}

export const getAdmins=()=> {
        const admins = db.query("SELECT * FROM users WHERE role = 'admin'");
        if(!admins||admins.length==0)
            throw new NotFoundError("No admins found");
        return admins;
}