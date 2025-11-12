import express from "express";
import { MonRouteur } from "./routes/approutes.js";
import morgan from "morgan";
import { NotFound } from "./middleware/NotFound.js";
import { errorHandler } from "./middleware/ErrorHandler.js";
import { AuthRouter } from "./routes/authroutes.js";
import { verifyToken } from './middleware/verifyToken.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from './routes/userRoutes.js';
import logsRoutes from "./routes/logsRoutes.js";
import http from "http"; 
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(express.json());
const server=http.createServer(app);
// Socket.IO
const io=new Server(server,{
    cors:{
        origin:"http://localhost:4200",
        methods:["GET","POST"]
    }
});
io.on('connection',(socket)=>{
    console.log('Client connecte:',socket.id);
    // Tu peux écouter des événements personnalisés, ex:
  socket.on("updateUser", (data) => {
    console.log("Demande de mise à jour:", data);
    // Ici on pourra notifier tous les clients après modif
    io.emit("userUpdated", data); // prévient tous les clients
});
});
app.use(morgan());
app.use(cors());
// app.use("/etudiants", verifyToken, role("user"), MonRouteur);
// Permet d'accéder aux fichiers uploadés
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api", uploadRoutes);
app.use("/etudiants", MonRouteur); //cette page est public pas de token
app.use("/auth", AuthRouter);
app.use("/users", userRoutes);
app.use("/logs", logsRoutes);
app.use("/etudiants", verifyToken, MonRouteur);
app.use(NotFound);
app.use(errorHandler);
export { app,server,io};