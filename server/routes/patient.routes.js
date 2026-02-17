import express from "express";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../controllers/patient.controller.js";

const router = express.Router();

// GET patient profile
router.get("/:id", getPatientProfile);

// UPDATE patient profile
router.put("/:id", updatePatientProfile);

export default router;
