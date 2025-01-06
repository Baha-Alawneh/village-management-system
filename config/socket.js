import { WebSocketServer } from 'ws';
import {  getAdmins } from "../models/users.js";

export const wss = new WebSocketServer({ noServer: true });


let clients = new Map();
let admins = new Map();
const adminsFromDB = await getAdmins();
adminsFromDB.forEach(admin => {
    admins.set(admin.username, { ws: null });
});

wss.on("connection", (ws) => {
  const clientId = `Client_${Math.random().toString(36).substring(7)}`;
  clients.set(clientId, ws);
  console.log(`${clientId} connected`);
  ws.send(JSON.stringify({ type: 'welcome', clientId, admins: Array.from(admins.keys()) }));

  ws.on("message", async (data) => {
    const message = JSON.parse(data);

    if (message.type === "direct-message") {
      const { from, to, content } = message;

      if (admins.has(to)) {
        const admin = admins.get(to);
        if (!admin.ws) {
          admins.set(to, { ws });
        }

        const adminWs = admins.get(to).ws;

        if (adminWs && adminWs.readyState === WebSocket.OPEN) {
          adminWs.send(
            JSON.stringify({
              type: "direct-message",
              from,
              content,
            })
          );
        }
      }
    }
  });
  ws.on("close", () => {
    clients.delete(clientId);
    console.log(`${clientId} disconnected`);
  });
});

  wss.on("close", (ws) => {
    admins.forEach((admin, username) => {
      if (admin.ws === ws) {
        admins.set(username, { ws: null });
        console.log(`Admin ${username} disconnected`);
      }
    });
  });
