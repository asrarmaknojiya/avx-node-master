import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 9096;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
const allowedOrigins = [
    "http://192.168.0.161:3000",
    "http://localhost:3000",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/v1/lookup/", apiRoutes);

// ✅ Health check
app.get("/", (req, res) => {
    res.send("Hello World from API v1!");
});

// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}/api/v1/lookup/`);
});
