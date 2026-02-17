import Request from "../models/Request.js";
import User from "../models/User.js";


// GET all approved requests
export const getApprovedRequests = async (req, res) => {
  try {
    const approvedRequests = await Request.find({ status: "approved" })
      .populate(
        "requesterId",
        "name role email phone bloodGroup organs hospitalName contactPerson website address state district googleMapLink"
      )
      .populate(
        "recipientId",
        "name role email phone bloodGroup organs hospitalName contactPerson website address state district googleMapLink"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(approvedRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE request
export const createRequest = async (req, res) => {
  try {
    const { requesterId, recipientId, type, message } = req.body;

    const requester = await User.findById(requesterId);
    const recipient = await User.findById(recipientId);

    if (!requester) return res.status(400).json({ message: "Invalid requester" });
    if (!recipient) return res.status(400).json({ message: "Invalid recipient" });

    const request = await Request.create({
      requesterId,
      recipientId,
      type,
      message,
    });

    res.status(201).json({ message: "Request created", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all requests for a recipient
export const getRequestsForRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;

    const requests = await Request.find({ recipientId })
      .populate("requesterId", "name role email phone bloodGroup organs hospitalName contactPerson website address state district googleMapLink")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all requests created by a user
export const getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await Request.find({ requesterId: userId })
      .populate("recipientId", "name role email phone bloodGroup organs hospitalName contactPerson website address state district googleMapLink")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE request status (approve/reject)
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    res.status(200).json({ message: "Request status updated", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
