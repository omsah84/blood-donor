"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Entity {
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
  recipientId: Entity;
  type: string; // blood | organ
  status: string;
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState<"blood" | "organ">("blood");

  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  // 🔹 Get logged-in organization
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      if (parsed.role === "organization") setUserId(parsed.id);
    }
  }, []);

  // 🔹 Fetch Blood Banks OR Organizations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          activeTab === "blood"
            ? "http://localhost:5000/api/blood-bank"
            : "http://localhost:5000/api/organization";

        const res = await axios.get(url);

        // Remove self if organ tab
        let data = res.data;
        if (activeTab === "organ") {
          data = data.filter((item: Entity) => item._id !== userId);
        }

        setEntities(data);
        setFilteredEntities(data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    if (userId) fetchData();
  }, [activeTab, userId]);

  // 🔹 Filter
  useEffect(() => {
    let filtered = [...entities];

    if (stateFilter)
      filtered = filtered.filter((e) =>
        e.state?.toLowerCase().includes(stateFilter.toLowerCase())
      );

    if (districtFilter)
      filtered = filtered.filter((e) =>
        e.district?.toLowerCase().includes(districtFilter.toLowerCase())
      );

    setFilteredEntities(filtered);
  }, [stateFilter, districtFilter, entities]);

  // 🔹 Fetch requests
  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/user/${userId}`
      );

      const filtered = res.data.filter(
        (req: Request) => req.type === activeTab
      );

      setRequests(filtered);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId, activeTab]);

  // 🔹 Modal
  const openModal = (id: string) => {
    setSelectedId(id);
    setModalMessage("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  // 🔹 Submit Request
  const submitRequest = async () => {
    if (!userId || !selectedId) return;

    setLoadingIds((prev) => [...prev, selectedId]);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/requests", {
        requesterId: userId,
        recipientId: selectedId,
        type: activeTab, // 🔥 dynamic type
        message: modalMessage,
      });

      setMessage(
        `${activeTab === "blood" ? "Blood" : "Organ"} request sent ✅`
      );

      fetchRequests();
      closeModal();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Request failed ❌");
      closeModal();
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== selectedId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Organization Dashboard
      </h2>

      {/* 🔹 Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("blood")}
          className={`px-4 py-2 rounded ${
            activeTab === "blood"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Blood Requests
        </button>

        <button
          onClick={() => setActiveTab("organ")}
          className={`px-4 py-2 rounded ${
            activeTab === "organ"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Organ Requests
        </button>
      </div>

      {/* 🔹 Filters */}
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

      {/* 🔹 Entity List */}
      <div className="grid gap-4 mb-8">
        {filteredEntities.map((item) => {
          const isLoading = loadingIds.includes(item._id);

          return (
            <div
              key={item._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>
                <p>
                  {item.address}, {item.district}, {item.state}
                </p>
                {item.phone && <p>Phone: {item.phone}</p>}
              </div>

              <button
                disabled={isLoading}
                onClick={() => openModal(item._id)}
                className={`px-4 py-2 rounded text-white ${
                  isLoading
                    ? "bg-gray-400"
                    : activeTab === "blood"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Sending..." : "Make Request"}
              </button>
            </div>
          );
        })}
      </div>

      {/* 🔹 Request History */}
      <h3 className="text-xl font-semibold mb-4">
        Your {activeTab === "blood" ? "Blood" : "Organ"} Requests
      </h3>

      <div className="grid gap-4">
        {requests.length === 0 && (
          <p className="text-gray-500">No requests found.</p>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            className="p-4 border rounded shadow"
          >
            <h4 className="font-semibold">
              {req.recipientId.name}
            </h4>
            <p>
              Status:
              <span
                className={`ml-2 font-semibold ${
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
        ))}
      </div>

      {/* 🔹 Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-4">
              Send {activeTab === "blood" ? "Blood" : "Organ"} Request
            </h3>

            <textarea
              placeholder="Add a message (optional)"
              className="w-full border p-2 rounded mb-4"
              value={modalMessage}
              onChange={(e) => setModalMessage(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                className={`px-4 py-2 rounded text-white ${
                  activeTab === "blood"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
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

export default OrganizationDashboard;
