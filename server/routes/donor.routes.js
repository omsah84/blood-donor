import express from "express";
import {
  getDonorProfile,
  updateDonorProfile,
} from "../controllers/donor.controller.js";

const router = express.Router();

// GET donor profile
router.get("/:id", getDonorProfile);

// UPDATE donor profile
router.put("/:id", updateDonorProfile);

export default router;
