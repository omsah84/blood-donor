import express from "express";
import { getAllUsers, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/",getAllUsers)

// GET user profile by ID
router.get("/:id", getUserProfile);

// UPDATE user profile by ID
router.put("/:id", updateUserProfile);

export default router;
