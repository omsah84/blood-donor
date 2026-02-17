"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Recipient {
  _id: string;
  name: string;
  role: string;
  address?: string;
  state?: string;
  district?: string;
  phone?: string;
  website?: string;
  googleMapLink?: string;
}

interface Request {
  _id: string;
  recipientId: Recipient;
  type: string; // "blood", "donation", etc.
  status: string; // pending, approved, rejected
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const MyRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Get logged-in user
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      setUserId(parsed.id);
    }
  }, []);

  // 🔹 Fetch all requests made by the user
  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/user/${userId}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Requests</h2>

      {loading && <p className="text-gray-500">Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="text-gray-500">You have not made any requests yet.</p>
      )}

      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="p-4 border rounded shadow flex justify-between items-start"
          >
            <div>
              <h4 className="font-semibold text-lg">
                {req.recipientId.name} ({req.recipientId.role})
              </h4>

              {/* Address */}
              {req.recipientId.address && (
                <p>
                  {req.recipientId.address}, {req.recipientId.district},{" "}
                  {req.recipientId.state}
                </p>
              )}

              {/* Phone */}
              {req.recipientId.phone && <p>Phone: {req.recipientId.phone}</p>}

              {/* Website */}
              {req.recipientId.website && (
                <p>
                  Website:{" "}
                  <a
                    href={req.recipientId.website}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {req.recipientId.website}
                  </a>
                </p>
              )}

              {/* Google Map Link */}
              {req.recipientId.googleMapLink && (
                <p>
                  Map:{" "}
                  <a
                    href={req.recipientId.googleMapLink}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View on Map
                  </a>
                </p>
              )}

              {/* Request Type */}
              <p>Type: {req.type}</p>

              {/* Status */}
              <p>
                Status:{" "}
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

              {/* Message */}
              {req.message && <p>Message: {req.message}</p>}

              {/* Created At */}
              <p className="text-gray-500 text-sm">
                {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
