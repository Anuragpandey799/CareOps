import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join rooms based on user or role later
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

// Helper functions to emit events from anywhere in the app
export const emitEvent = (event, data, room = null) => {
  if (!io) return;

  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
};
