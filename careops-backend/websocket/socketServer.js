import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        // ✅ Allow localhost
        if (origin.startsWith("http://localhost")) {
          return callback(null, true);
        }

        // ✅ Allow all Vercel deployments of your project
        if (origin.includes("vercel.app")) {
          return callback(null, true);
        }

        console.log("❌ Socket CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

// Emit helper
export const emitEvent = (event, data, room = null) => {
  if (!io) return;

  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
};
