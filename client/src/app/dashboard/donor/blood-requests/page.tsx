"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface BloodBank {
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
  recipientId: BloodBank;
  type: string;
  status: string;
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

const DonorRequestBloodBank = () => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<BloodBank[]>([]);
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingBankIds, setLoadingBankIds] = useState<string[]>([]);

  // Modal states
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showUnitsModal, setShowUnitsModal] = useState(false);
  const [units, setUnits] = useState<number>(1);

  // Health answers
  const [healthAnswers, setHealthAnswers] = useState({
    healthy: "",
    recentIllness: "",
    donationDurationOk: "",
  });

  // 🔹 Logged-in donor
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      if (parsed.role === "donor") setUserId(parsed.id);
    }
  }, []);

  // 🔹 Fetch blood banks
  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blood-bank");
        setBloodBanks(res.data);
        setFilteredBanks(res.data);
      } catch {
        toast.error("Failed to fetch blood banks");
      }
    };
    fetchBloodBanks();
  }, []);

  // 🔹 Filter blood banks
  useEffect(() => {
    let filtered = [...bloodBanks];
    if (stateFilter) filtered = filtered.filter((b) =>
      b.state?.toLowerCase().includes(stateFilter.toLowerCase())
    );
    if (districtFilter) filtered = filtered.filter((b) =>
      b.district?.toLowerCase().includes(districtFilter.toLowerCase())
    );
    setFilteredBanks(filtered);
  }, [stateFilter, districtFilter, bloodBanks]);

  // 🔹 Fetch donor requests
  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/user/${userId}`);
      setRequests(res.data);
    } catch {
      toast.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  // 🔹 Open pre-check modal
  const handleDonateClick = (bank: BloodBank) => {
    setSelectedBank(bank);
    setShowHealthModal(true);
  };

  // 🔹 Submit donation request
  const submitRequest = async () => {
    if (!userId || !selectedBank) return;

    // Combine health answers and units in message
    const message = `Health Check: ${JSON.stringify(healthAnswers)}, Units: ${units}`;

    setLoadingBankIds((prev) => [...prev, selectedBank._id]);
    try {
      await axios.post("http://localhost:5000/api/requests", {
        requesterId: userId,
        recipientId: selectedBank._id,
        type: "blood",
        message: `Units: ${units}`, // only units
      });
      toast.success("Request sent successfully ✅");
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Request failed ❌");
    } finally {
      setLoadingBankIds((prev) => prev.filter((id) => id !== selectedBank._id));
      setSelectedBank(null);
      setShowHealthModal(false);
      setShowUnitsModal(false);
      setHealthAnswers({ healthy: "", recentIllness: "", donationDurationOk: "" });
      setUnits(1);
    }
  };

  // 🔹 Check if all health answers are yes
  const allYes = Object.values(healthAnswers).every((v) => v === "Yes");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold mb-4">Donate to Blood Banks</h2>

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

      {/* Blood Bank List */}
      <div className="grid gap-4 mb-8">
        {filteredBanks.length === 0 && <p className="text-gray-500">No blood banks found.</p>}

        {filteredBanks.map((bank) => {
          const isLoading = loadingBankIds.includes(bank._id);
          return (
            <div key={bank._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{bank.name}</h3>
                <p>{bank.address}, {bank.district}, {bank.state}</p>
                {bank.phone && <p>Phone: {bank.phone}</p>}
                {bank.website && <a href={bank.website} target="_blank" className="text-blue-600 underline">Website</a>}
                {bank.googleMapLink && <a href={bank.googleMapLink} target="_blank" className="text-blue-600 underline ml-2">Map</a>}
              </div>
              <button
                disabled={isLoading}
                onClick={() => handleDonateClick(bank)}
                className={`px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isLoading ? "Sending..." : "Donate"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Requests Sent */}
      <h3 className="text-xl font-semibold mb-4">Your Donation Requests</h3>
      <div className="grid gap-4">
        {requests.length === 0 && <p className="text-gray-500">No requests sent yet.</p>}
        {requests.map((req) => (
          <div key={req._id} className="p-4 border rounded shadow flex flex-col">
            <h4 className="font-semibold">{req.recipientId.name}</h4>
            <p>{req.recipientId.address}, {req.recipientId.district}, {req.recipientId.state}</p>
            <p>Status: <span className={`font-semibold ${req.status === "approved" ? "text-green-600" : req.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>{req.status}</span></p>
            {req.message && <p><strong>Message:</strong> {req.message}</p>}
          </div>
        ))}
      </div>

      {/* Pre-check Modal */}
      {showHealthModal && selectedBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Health Check for {selectedBank.name}</h2>
            <p className="mb-4">All answers must be Yes to proceed:</p>

            {["healthy", "recentIllness", "donationDurationOk"].map((key) => (
              <div key={key} className="mb-3">
                <p className="font-medium">
                  {key === "healthy" ? "Are you feeling healthy today?" :
                   key === "recentIllness" ? "Any recent illnesses?" :
                   "Have you donated in the last 3 months?"}
                </p>
                <div className="flex gap-4 mt-1">
                  <button onClick={() => setHealthAnswers(prev => ({ ...prev, [key]: "Yes" }))} className="px-3 py-1 bg-green-600 text-white rounded">Yes</button>
                  <button onClick={() => setHealthAnswers(prev => ({ ...prev, [key]: "No" }))} className="px-3 py-1 bg-red-600 text-white rounded">No</button>
                </div>
                {healthAnswers[key as keyof typeof healthAnswers] && (
                  <p className="mt-1 text-gray-600">Selected: {healthAnswers[key as keyof typeof healthAnswers]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowHealthModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button
                disabled={!allYes}
                onClick={() => { setShowHealthModal(false); setShowUnitsModal(true); }}
                className={`px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 ${!allYes ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Next
              </button>
            </div>
            {!allYes && <p className="text-red-600 mt-2">All answers must be "Yes" to proceed.</p>}
          </div>
        </div>
      )}

      {/* Units / Message Modal */}
      {showUnitsModal && selectedBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Donation Details</h2>
            <p className="mb-2">How many units do you want to donate?</p>
            <input
              type="number"
              min={1}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowUnitsModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button onClick={submitRequest} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorRequestBloodBank;
