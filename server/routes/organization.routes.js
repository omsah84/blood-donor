import express from "express";
import {
  getOrganizationProfile,
  updateOrganizationProfile,
  getAllOrganizations
} from "../controllers/organization.controller.js";

const router = express.Router();

// Get all blood banks
router.get("/", getAllOrganizations);

// GET profile
router.get("/:id", getOrganizationProfile);

// UPDATE profile
router.put("/:id", updateOrganizationProfile);

export default router;
