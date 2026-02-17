import express from "express";
import {
  createRequest,
  getRequestsForRecipient,
  getRequestsByUser,
  updateRequestStatus,
  getApprovedRequests,
} from "../controllers/request.controller.js";

const router = express.Router();

// Create a request
router.post("/", createRequest);

router.get("/approved", getApprovedRequests);

// Get all requests for a recipient
router.get("/recipient/:recipientId", getRequestsForRecipient);

// Get all requests created by a user
router.get("/user/:userId", getRequestsByUser);

// Update request status (approve/reject)
router.put("/:requestId", updateRequestStatus);

export default router;
