import express from "express";
import dotenv from "dotenv";
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



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


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
