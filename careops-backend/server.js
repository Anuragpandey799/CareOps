import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";




import { initSocket } from "./websocket/socketServer.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Initialize socket from modular file
initSocket(server);


// cors
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  process.env.FRONTEND_URL, // production frontend (Vercel)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/dashboard", dashboardRoutes);




app.get("/", (req, res) => {
  res.send("CareOps Backend is Running 🚀 with WebSockets");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT} http://localhost:${PORT}`)
);
