"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Requester {
  _id: string;
  name: string;
  role: string;
}

interface Request {
  _id: string;
  requesterId: Requester;
  type: string; // "blood", "donation", etc.
  status: string; // pending, approved, rejected
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const BloodBankRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingRequestIds, setLoadingRequestIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // Get logged-in blood bank ID
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      if (parsed.role === "bloodBank") setUserId(parsed.id);
    }
  }, []);

  // Fetch all requests for this blood bank
  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/recipient/${userId}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  // Approve or reject a request
  const handleAction = async (requestId: string, action: "approved" | "rejected") => {
    setLoadingRequestIds((prev) => [...prev, requestId]);
    setMessage("");

    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}`, {
        status: action,
      });
      setMessage(`Request ${action} successfully ✅`);
      fetchRequests(); // Refresh list
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Action failed ❌");
    } finally {
      setLoadingRequestIds((prev) => prev.filter((id) => id !== requestId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Incoming Requests</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="grid gap-4">
        {requests.length === 0 && (
          <p className="text-gray-500">No requests found.</p>
        )}

        {requests.map((req) => {
          const isLoading = loadingRequestIds.includes(req._id);

          return (
            <div
              key={req._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">
                  {req.requesterId.name} ({req.requesterId.role})
                </h4>
                <p>Type: {req.type}</p>
                <p>Status:{" "}
                  <span
                    className={`font-semibold ${
                      req.status === "approved"
                        ? "text-green-600"
                        : req.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
                {req.message && <p>Message: {req.message}</p>}
                <p className="text-gray-500 text-sm">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    disabled={isLoading}
                    onClick={() => handleAction(req._id, "approved")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    {isLoading ? "..." : "Approve"}
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => handleAction(req._id, "rejected")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    {isLoading ? "..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BloodBankRequests;
