"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Organization {
  _id: string;
  name: string;
  phone?: string;
  website?: string;
  address?: string;
  state?: string;
  district?: string;
  googleMapLink?: string;
}

interface Request {
  _id: string;
  recipientId: Organization;
  type: string;
  status: string;
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const PatientOrganizationRequestWithModal = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingOrgIds, setLoadingOrgIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrgId, setModalOrgId] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  // 🔹 Get logged-in patient ID
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      if (parsed.role === "patient") setUserId(parsed.id);
    }
  }, []);

  // 🔹 Fetch organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/organization");
        setOrganizations(res.data);
        setFilteredOrgs(res.data);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      }
    };
    fetchOrganizations();
  }, []);

  // 🔹 Filter organizations by state/district
  useEffect(() => {
    let filtered = [...organizations];
    if (stateFilter)
      filtered = filtered.filter((o) =>
        o.state?.toLowerCase().includes(stateFilter.toLowerCase())
      );
    if (districtFilter)
      filtered = filtered.filter((o) =>
        o.district?.toLowerCase().includes(districtFilter.toLowerCase())
      );
    setFilteredOrgs(filtered);
  }, [stateFilter, districtFilter, organizations]);

  // 🔹 Fetch requests sent by patient
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

  // 🔹 Open modal for selected organization
  const openModal = (orgId: string) => {
    setModalOrgId(orgId);
    setModalMessage("");
    setModalOpen(true);
  };

  // 🔹 Close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalOrgId(null);
    setModalMessage("");
  };

  // 🔹 Submit request from modal
  const submitRequest = async () => {
    if (!userId || !modalOrgId) return;

    setLoadingOrgIds((prev) => [...prev, modalOrgId]);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/requests", {
        requesterId: userId,
        recipientId: modalOrgId,
        type: "organ",
        message: modalMessage,
      });
      setMessage("Request sent successfully ✅");
      fetchRequests(); // refresh requests
      closeModal();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Request failed ❌");
      closeModal();
    } finally {
      setLoadingOrgIds((prev) => prev.filter((id) => id !== modalOrgId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Organization Requests</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by State"
          className="border p-2 rounded w-1/2"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by District"
          className="border p-2 rounded w-1/2"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        />
      </div>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {/* Organization List */}
      <div className="grid gap-4 mb-8">
        {filteredOrgs.map((org) => {
          const isLoading = loadingOrgIds.includes(org._id);
          return (
            <div
              key={org._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{org.name}</h3>
                <p>
                  {org.address}, {org.district}, {org.state}
                </p>
                {org.phone && <p>Phone: {org.phone}</p>}
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Website
                  </a>
                )}
                {org.googleMapLink && (
                  <a
                    href={org.googleMapLink}
                    target="_blank"
                    className="text-blue-600 underline ml-2"
                  >
                    Map
                  </a>
                )}
              </div>
              <button
                disabled={isLoading}
                onClick={() => openModal(org._id)}
                className={`px-4 py-2 rounded text-white ${
                  isLoading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Sending..." : "Make Request"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Requests Sent */}
      <h3 className="text-xl font-semibold mb-4">Your Requests</h3>
      <div className="grid gap-4">
        {requests.length === 0 && (
          <p className="text-gray-500">No requests sent yet.</p>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{req.recipientId.name}</h4>
              <p>
                {req.recipientId.address}, {req.recipientId.district},{" "}
                {req.recipientId.state}
              </p>
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <h3 className="text-xl font-semibold mb-4">Send Request</h3>
            <textarea
              placeholder="Add a message (optional)"
              className="w-full border p-2 rounded mb-4"
              value={modalMessage}
              onChange={(e) => setModalMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOrganizationRequestWithModal;
