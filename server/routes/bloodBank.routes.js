import express from "express";
import {
  getBloodBankProfile,
  updateBloodBankProfile,
  getAllBloodBanks
} from "../controllers/bloodBank.controller.js";

const router = express.Router();


// Get all blood banks
router.get("/", getAllBloodBanks);
// GET blood bank profile
router.get("/:id", getBloodBankProfile);

// UPDATE blood bank profile
router.put("/:id", updateBloodBankProfile);

export default router;
