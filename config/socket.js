import { WebSocketServer, WebSocket } from 'ws';
import { getAdmins,findUserById,findUser } from "../models/users.js";

export const wss = new WebSocketServer({ noServer: true });

let clients = new Map();
let admins = new Map(); 
const initializeAdmins = async () => {
  const adminsFromDB = await getAdmins();
  adminsFromDB.forEach(admin => {
    admins.set(admin.username, { ws: null });
  });
};
initializeAdmins();

wss.on("connection", (ws, request) => {
  const clientId = `Client_${Math.random().toString(36).substring(7)}`;
  let username = null;
  let isCurrentAdmin;

  console.log(`${clientId} connected`);

  ws.on("message", async (data) => {
    const message = JSON.parse(data);
    if (message.type === "authenticate") {
       const id = message.user_id;
       isCurrentAdmin=message.isAdmin;
       const user=await findUserById(id);
       username = user[0].username;
      if (user[0].role === "admin") {
        console.log(`Admin ${user[0].username} authenticated.`);
        admins.set(user[0].username, { ws });
      } else {
        console.log(`User ${user[0].username} authenticated.`);
        clients.set(user[0].username, { ws });
        ws.send(JSON.stringify({ type: 'welcome', id:"user"+id, role: 'client' }));
      }
    }
    if (message.type === "direct-message") {
      const { from, to, content,isAdmin } = message;
        const user=await findUser(from);

        if (user.length === 0) {
          console.log(`User ${from} not found in the database.`);
          ws.close();
        }

      console.log(`Direct Message from ${from} to ${to}`);
      console.log(isAdmin);
      if (isAdmin) {
       console.log("Direct Message from admin:", from);
       console.log("Direct Message to user:", to);
        const clientWs = clients.get(to)?.ws;
        console.log("found ws", clientWs);
        if (clientWs && clientWs.readyState === WebSocket.OPEN) {
          console.log("hi");
          clientWs.send(JSON.stringify({
            type: "direct-message",
            from,
            content
          }));
        }
      } else {
         console.log("hereeeee");
        const adminWs = admins.get(to)?.ws;
        if (adminWs && adminWs.readyState === WebSocket.OPEN) {
          console.log("sending direct-message from user:", from, "to", to);
          adminWs.send(JSON.stringify({
            type: "direct-message",
            from,
            content
          }));
        }
      }
    }
  });

  ws.on("close", () => {
    if (isCurrentAdmin && username) {
      admins.set(username, { ws: null });
      console.log(`Admin ${username} disconnected`);
    } else if (username) {
      clients.delete(username);
      console.log(`${username} disconnected`);
    }
  });
});
