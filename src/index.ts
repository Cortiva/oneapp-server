import express, { Express } from "express";
import cors from "cors";
import http from "http";
import routes from "./routes";

const app: Express = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const allowedOrigins = ["http://localhost", "http://localhost:3000"];

const corsOption = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOption));

app.use(express.json());

// Routes
app.use("/api/v1", routes());

// Server Running
server.listen(8080, () => {
  console.log(`🎉🎉🎉🎉🎉🎉 API is running on port ${8080}`);
});

// Cleanup on server shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
