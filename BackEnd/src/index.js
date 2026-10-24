require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const labelRoutes = require("./routes/labels");
const noteRoutes = require("./routes/notes");
const notificationRoutes = require("./routes/notifications");

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "noteflow-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Đã xảy ra lỗi ngoài ý muốn.", error: error.message });
});

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.set('io', io);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(`user_${userId}`);
  }
});

initDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`NoteFlow API & Socket.IO đang chạy tại http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Không thể khởi tạo cơ sở dữ liệu:", error);
    process.exit(1);
  });
