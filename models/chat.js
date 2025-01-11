import db from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { v4 as uuidv4 } from 'uuid';




export const getChatByUserAndAdmin = async (user, admin) => {
    console.log(`Fetching chats for user: ${user}, admin: ${admin}`);
    const [rows] = await db.query('SELECT chat FROM chat WHERE user = ? AND admin = ?', [user, admin]);
    console.log(rows);

    if (!rows || rows.length === 0) {
        return null; 
    }

    return rows[0]; 
};


export const insertOrUpdateChat = async (user, admin, newChat) => {
    console.log(`Processing chat for user: ${user}, admin: ${admin}`);
    const [existingChat] = await db.query('SELECT chat FROM chat WHERE user = ? AND admin = ?', [user, admin]);
    console.log('Existing Chat:', existingChat);

    if (existingChat.length > 0) {
        const oldChat = existingChat[0].chat;
        const updatedChat = `${oldChat},${newChat}`;
        
        const [updateResult] = await db.query(
            'UPDATE chat SET chat = ? WHERE user = ? AND admin = ?',
            [updatedChat, user, admin]
        );
        console.log('Update Result:', updateResult);

        if (updateResult.affectedRows > 0) {
            return { success: true, message: 'Chat updated successfully' };
        } else {
            throw new Error('Failed to update chat');
        }
    } else {
        const [insertResult] = await db.query(
            'INSERT INTO chat (user, admin, chat) VALUES (?, ?, ?)',
            [user, admin, newChat]
        );
        console.log('Insert Result:', insertResult);

        if (insertResult.affectedRows > 0) {
            return { success: true, chatId: insertResult.insertId, message: 'Chat inserted successfully' };
        } else {
            throw new Error('Failed to insert chat');
        }
    }
};

