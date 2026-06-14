import { Server } from "socket.io";

const roomsAndClientsmap = {};

export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("JOIN", ({ roomId, username }) => {
      socket.join(roomId);

      if (roomId in roomsAndClientsmap) {
        roomsAndClientsmap[roomId].clients.push({
          socketId: socket.id,
          username: username || "Unknown Client",
        });
      } else {
        roomsAndClientsmap[roomId] = {
          code: "// your code...",
          clients: [{ socketId: socket.id, username }],
        };
      }

      io.to(socket.id).emit("JOINED", {
        code: roomsAndClientsmap[roomId].code,
        clients: roomsAndClientsmap[roomId].clients,
      });
    });

    socket.on("code change", ({ roomId, newCode }) => {
      if (roomsAndClientsmap[roomId]) {
        roomsAndClientsmap[roomId].code = newCode;
      }
      socket.in(roomId).emit("code change", { newCode });
    });

    socket.on("leave", (roomId) => {
      const clients = roomsAndClientsmap[roomId]?.clients;
      if (clients) {
        const index = clients.findIndex((cli) => cli.socketId == socket.id);
        const client = clients[index];
        if (index !== -1) clients.splice(index, 1);
        socket.in(roomId).emit("disconnected", { username: client?.username });
      }
      socket.leave();
    });
  });
}
