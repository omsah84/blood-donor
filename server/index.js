import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organization.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import bloodBankRoutes from "./routes/bloodBank.routes.js";
import requestRoutes from "./routes/request.routes.js";
import userRoutes from "./routes/user.routes.js";
import campRoutes from "./routes/campRoutes.js"


const app = express();

connectDB();

app.use(express.json());

const allowedOrigins = ["http://localhost:3002", "http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/blood-bank", bloodBankRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/camps", campRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
