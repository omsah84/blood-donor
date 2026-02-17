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
}

interface Request {
  _id: string;
  recipientId: Recipient;
  type: string; // blood | organ
  status: string;
  message?: string; // "Units: 2" or "Units: 3 piece"
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const MyRequestsDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      setUserId(parsed.id);
    }
  }, []);

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/user/${userId}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  /* ================= Dashboard Calculations ================= */

  const totalRequests = requests.length;

  const approvedRequests = requests.filter(
    (req) => req.status === "approved"
  );

  const approvedCount = approvedRequests.length;

  const pendingCount = requests.filter((req) => req.status === "pending")
    .length;

  const rejectedCount = requests.filter((req) => req.status === "rejected")
    .length;

  // 🎁 Reward: 10 points per approved
  const rewardPoints = approvedCount * 10;

  // Helper: extract unit and unitType from message
  const parseUnits = (message?: string) => {
    if (!message) return { unit: 0, unitType: "" };
    // Expecting format: "Units: 2" or "Units: 500 ml" or "Units: 1 piece"
    const match = message.match(/Units:\s*(\d+(\.\d+)?)(\s*(ml|L|piece))?/i);
    if (!match) return { unit: 0, unitType: "" };
    return { unit: parseFloat(match[1]), unitType: match[4] || "" };
  };

  // 🩸 Total Blood in Liters
  const totalBloodLiters = approvedRequests
    .filter((req) => req.type === "blood")
    .reduce((total, req) => {
      const { unit, unitType } = parseUnits(req.message);
      if (unitType === "ml") return total + unit / 1000;
      if (unitType === "L" || unitType === "") return total + unit;
      return total;
    }, 0);

  // 🫀 Total Organ Units
  const totalOrganUnits = approvedRequests
    .filter((req) => req.type === "organ")
    .reduce((total, req) => {
      const { unit } = parseUnits(req.message);
      return total + unit;
    }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ================= Dashboard ================= */}
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-100 rounded shadow">
          <p>Total Requests</p>
          <p className="text-2xl font-bold">{totalRequests}</p>
        </div>

        <div className="p-4 bg-green-100 rounded shadow">
          <p>Approved</p>
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
        </div>

        <div className="p-4 bg-yellow-100 rounded shadow">
          <p>Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="p-4 bg-red-100 rounded shadow">
          <p>Rejected</p>
          <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>

        <div className="p-4 bg-purple-100 rounded shadow">
          <p>Reward Points</p>
          <p className="text-2xl font-bold text-purple-600">{rewardPoints}</p>
        </div>

        <div className="p-4 bg-pink-100 rounded shadow">
          <p>Total Blood Donated</p>
          <p className="text-2xl font-bold text-pink-600">
            {totalBloodLiters.toFixed(2)} L
          </p>
        </div>

        {/* <div className="p-4 bg-indigo-100 rounded shadow">
          <p>Total Organ Units</p>
          <p className="text-2xl font-bold text-indigo-600">
            {totalOrganUnits}
          </p>
        </div> */}
      </div>

      {/* ================= Requests List ================= */}
      <h2 className="text-2xl font-semibold mb-4">My Requests</h2>

      <div className="grid gap-4">
        {requests.map((req) => {
          const { unit, unitType } = parseUnits(req.message);
          return (
            <div key={req._id} className="p-4 border rounded shadow">
              <h4 className="font-semibold">
                {req.recipientId.name} ({req.recipientId.role})
              </h4>

              <p>Type: {req.type}</p>

              {unit > 0 && (
                <p>
                  Unit: {unit} {unitType || (req.type === "blood" ? "L" : "piece")}
                </p>
              )}

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

              <p className="text-gray-500 text-sm">
                {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequestsDashboard;
