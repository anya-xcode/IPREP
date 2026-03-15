require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const questionRoutes = require("../routes/questionRoutes")
const resourceRoutes = require("../routes/resourceRoutes")
const app = express();

const frontendUrl = process.env.FRONTEND_URL || "*";
app.use(cors({
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use("/api/questions", questionRoutes)
app.use("/api/resources", resourceRoutes)
const server = http.createServer(app);

/* SOCKET SETUP */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: frontendUrl }
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
});

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend Running");
});

server.listen(5000, () => {
  console.log("Server running");
});