const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

const path = require("path");


// DATABASE CONNECTION

const connectDb = require("./config/db");

connectDb();


// CREATE HTTP SERVER

const server = http.createServer(app);


// SOCKET.IO

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    credentials: true,
  },
});


// SOCKET CONNECTION

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("joinWorkspace", (workspaceId) => {

    socket.join(workspaceId);

    console.log(`Joined workspace ${workspaceId}`);

  });

  socket.on("disconnect", () => {

    console.log("User disconnected");

  });

});


// CORS

const corsOptions = {
  origin: ["http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


// CRON

require("./cron/deleteTrashTask");


// MIDDLEWARE

app.use(cors(corsOptions));

app.use(express.json());


// ROUTES

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.use("/api/categories", require("./routes/categoryRoutes"));

app.use("/api", require("./routes/reportRoutes"));

app.use("/uploads", express.static("uploads"));

app.use("/api/workspace", require("./routes/workspaceRoutes"));

app.use("/api/workspace",require("./routes/workspaceTaskRoutes"));

app.use("/api/workspace",require("./routes/authRoutes"));

app.use("/api/workspace",require("./routes/workspaceCaregoryroutes"))

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/workspaces", require("./routes/workspaceRoutes"))

app.use("/api/budget", require("./routes/budgetRoutes"));

// START SERVER

server.listen(process.env.PORT || 5000, () => {

  console.log(`Listening at port ${process.env.PORT || 5000}`);

});