"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  role: string;
  address?: string;
  state?: string;
  district?: string;
  phone?: string;
}

interface Request {
  _id: string;
  requesterId: User;
  recipientId: User;
  type: "blood" | "organ";
  status: "pending" | "approved" | "rejected";
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const OrganizationFullDashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<Request[]>([]);
  const [outgoing, setOutgoing] = useState<Request[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // Get logged-in organization
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      if (parsed.role === "organization") setUserId(parsed.id);
    }
  }, []);

  // Fetch incoming requests (patients → organization)
  const fetchIncoming = async () => {
    if (!userId) return;
    const res = await axios.get(
      `http://localhost:5000/api/requests/recipient/${userId}`
    );
    setIncoming(res.data);
  };

  // Fetch outgoing requests (organization → blood bank)
  const fetchOutgoing = async () => {
    if (!userId) return;
    const res = await axios.get(
      `http://localhost:5000/api/requests/user/${userId}`
    );
    setOutgoing(res.data);
  };

  useEffect(() => {
    fetchIncoming();
    fetchOutgoing();
  }, [userId]);

  /* ================= Summary ================= */

  const totalIncoming = incoming.length;
  const totalOutgoing = outgoing.length;

  const bloodIncoming = incoming.filter(r => r.type === "blood");
  const organIncoming = incoming.filter(r => r.type === "organ");

  const bloodOutgoing = outgoing.filter(r => r.type === "blood");

  const approvedCount = incoming.filter(r => r.status === "approved").length;
  const pendingCount = incoming.filter(r => r.status === "pending").length;

  /* ================= Approve / Reject ================= */

  const handleAction = async (
    requestId: string,
    action: "approved" | "rejected"
  ) => {
    setLoadingIds(prev => [...prev, requestId]);
    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}`, {
        status: action,
      });
      fetchIncoming();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== requestId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* ================= Dashboard ================= */}
      <h2 className="text-2xl font-semibold mb-6">
        Organization Dashboard
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">

        <div className="p-4 bg-blue-100 rounded shadow">
          <p>Incoming</p>
          <p className="text-2xl font-bold">{totalIncoming}</p>
        </div>

        <div className="p-4 bg-purple-100 rounded shadow">
          <p>Outgoing</p>
          <p className="text-2xl font-bold">{totalOutgoing}</p>
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

        <div className="p-4 bg-pink-100 rounded shadow">
          <p>Blood 🩸</p>
          <p className="text-2xl font-bold text-pink-600">
            {bloodIncoming.length}
          </p>
        </div>

        <div className="p-4 bg-indigo-100 rounded shadow">
          <p>Organ 🫀</p>
          <p className="text-2xl font-bold text-indigo-600">
            {organIncoming.length}
          </p>
        </div>

      </div>

      {/* ================= Incoming ================= */}
      <h3 className="text-xl font-semibold mb-4">
        Incoming Requests (Patients)
      </h3>

      {incoming.map(req => {
        const isLoading = loadingIds.includes(req._id);

        return (
          <div key={req._id} className="p-4 border rounded mb-4 shadow">
            <h4 className="font-semibold">
              {req.requesterId?.name} ({req.type})
            </h4>

            <p>Status:
              <span className={`ml-2 font-semibold ${
                req.status === "approved"
                  ? "text-green-600"
                  : req.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
                {req.status}
              </span>
            </p>

            {req.message && <p>Message: {req.message}</p>}

            {req.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <button
                  disabled={isLoading}
                  onClick={() => handleAction(req._id, "approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button
                  disabled={isLoading}
                  onClick={() => handleAction(req._id, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* ================= Outgoing ================= */}
      <h3 className="text-xl font-semibold mt-10 mb-4">
        Sent Requests (To Blood Banks)
      </h3>

      {bloodOutgoing.map(req => (
        <div key={req._id} className="p-4 border rounded mb-4 shadow">
          <h4 className="font-semibold">
            {req.recipientId?.name} (Blood)
          </h4>

          <p>Status:
            <span className={`ml-2 font-semibold ${
              req.status === "approved"
                ? "text-green-600"
                : req.status === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}>
              {req.status}
            </span>
          </p>

          {req.message && <p>Message: {req.message}</p>}
        </div>
      ))}

    </div>
  );
};

export default OrganizationFullDashboard;
