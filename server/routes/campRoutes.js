import express from "express";
import {
  createCamp,
  getAllCamps,
  getCampById,
  updateCamp,
  deleteCamp,
} from "../controllers/camp.controller.js";

const router = express.Router();

// ---------- CAMP ROUTES ----------

// Create a new camp
// POST /api/camps
router.post("/", createCamp);

// Get all camps
// GET /api/camps
router.get("/", getAllCamps);

// Get single camp by ID
// GET /api/camps/:id
router.get("/:id", getCampById);

// Update a camp
// PUT /api/camps/:id
router.put("/:id", updateCamp);

// Delete a camp
// DELETE /api/camps/:id
router.delete("/:id", deleteCamp);

export default router;
