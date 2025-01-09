import db from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { v4 as uuidv4 } from 'uuid';

export const getUserByName=async(name)=> {
    const user = await db.query("SELECT * FROM users WHERE username = ?", [name]);
    if(!user||user.length==0)
        throw new NotFoundError("User not found");
    return user[0];
}

export const getAdmins=async()=> {
        const [admins] = await db.query("SELECT * FROM users WHERE role = 'admin'");
        if(!admins||admins.length==0)
            throw new NotFoundError("No admins found");
        return admins;
}
export const getUsers=async()=> {
    const [users] = await db.query("SELECT * FROM users WHERE role = 'user'");
        if(!users||users.length==0)
            throw new NotFoundError("No users found");
        return users;
}

export const findUser = async (username) => {
    console.log(username);
    const result = await db.query('SELECT * FROM users WHERE username =?', [username]);
    const users = result[0];

    if (users.length === 0) {
        return "User not found";
    }

    const user = users[0];
    return user;
}



export const registerUser=async(user) => {
    const {username,password,full_name,role} = user;
    const id = uuidv4();
    const newUser = db.query(
        "INSERT INTO users (user_id, username, full_name, password, role) VALUES (?,?,?,?,?)",
        [id, username, full_name, password, role]
    );
    return newUser;


}
export const findUserById = async (id) => {
    console.log(id);
    const user = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
     console.log(user[0]);
    if (!user || user.length === 0) {
      return null; // or throw a NotFoundError, if preferred
    }
  
    return user[0]; // Returning the first user if found
  };


  