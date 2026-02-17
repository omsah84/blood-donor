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
  type: string; // "blood" | "organ"
  status: string; // pending | approved | rejected
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const MyPatientRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Get logged-in patient
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      setUserId(parsed.id);
    }
  }, []);

  // 🔹 Fetch patient requests
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

  /* ================= Dashboard Calculations ================= */

  const totalRequests = requests.length;

  const approvedCount = requests.filter(
    (req) => req.status === "approved"
  ).length;

  const pendingCount = requests.filter(
    (req) => req.status === "pending"
  ).length;

  const rejectedCount = requests.filter(
    (req) => req.status === "rejected"
  ).length;

  const bloodCount = requests.filter(
    (req) => req.type === "blood"
  ).length;

  const organCount = requests.filter(
    (req) => req.type === "organ"
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* ================= Dashboard ================= */}
      <h2 className="text-2xl font-semibold mb-6">
        Patient Dashboard Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">

        <div className="p-4 bg-blue-100 rounded shadow">
          <p>Total Requests</p>
          <p className="text-2xl font-bold">{totalRequests}</p>
        </div>

        <div className="p-4 bg-green-100 rounded shadow">
          <p>Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {approvedCount}
          </p>
        </div>

        <div className="p-4 bg-yellow-100 rounded shadow">
          <p>Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingCount}
          </p>
        </div>

        <div className="p-4 bg-red-100 rounded shadow">
          <p>Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {rejectedCount}
          </p>
        </div>

        <div className="p-4 bg-pink-100 rounded shadow">
          <p>Blood Requests 🩸</p>
          <p className="text-2xl font-bold text-pink-600">
            {bloodCount}
          </p>
        </div>

        <div className="p-4 bg-indigo-100 rounded shadow">
          <p>Organ Requests 🫀</p>
          <p className="text-2xl font-bold text-indigo-600">
            {organCount}
          </p>
        </div>

      </div>

      {/* ================= Request List ================= */}
      <h2 className="text-2xl font-semibold mb-4">My Requests</h2>

      {loading && <p className="text-gray-500">Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="text-gray-500">
          You have not made any requests yet.
        </p>
      )}

      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="p-4 border rounded shadow"
          >
            <h4 className="font-semibold text-lg">
              {req.recipientId.name} ({req.recipientId.role})
            </h4>

            {req.recipientId.address && (
              <p>
                {req.recipientId.address}, {req.recipientId.district},{" "}
                {req.recipientId.state}
              </p>
            )}

            {req.recipientId.phone && (
              <p>Phone: {req.recipientId.phone}</p>
            )}

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

            <p>Type: {req.type}</p>

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

            {req.message && <p>Message: {req.message}</p>}

            <p className="text-gray-500 text-sm">
              {new Date(req.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPatientRequests;
