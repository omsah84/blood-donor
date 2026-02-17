"use client";

import { useEffect, useState, useRef } from "react";
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
  type: string;
  status: string;
  message?: string;
  createdAt: string;
}

interface StoredUser {
  id: string;
  role: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const PatientRequestCombined = () => {
  const [type, setType] = useState<"blood" | "organ">("blood");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filtered, setFiltered] = useState<Entity[]>([]);
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const activeFieldRef = useRef<"state" | "district">("state");

  // 🔥 Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
        .toLowerCase()
        .trim();

      if (activeFieldRef.current === "state") {
        setStateFilter(text);
      } else {
        setDistrictFilter(text);
      }
    };

    recognition.onerror = (event: any) => {
      alert("Speech error: " + event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const startVoice = (field: "state" | "district") => {
    if (!recognitionRef.current) {
      alert("Speech not supported in this browser.");
      return;
    }
    activeFieldRef.current = field;
    recognitionRef.current.start();
  };

  // 🔹 Get logged-in user
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: StoredUser = JSON.parse(user);
      if (parsed.role === "patient") setUserId(parsed.id);
    }
  }, []);

  // 🔹 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          type === "blood"
            ? "http://localhost:5000/api/blood-bank"
            : "http://localhost:5000/api/organization";

        const res = await axios.get(url);
        setEntities(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [type]);

  // 🔹 Filtering
  useEffect(() => {
    let result = [...entities];

    if (stateFilter)
      result = result.filter((e) =>
        e.state?.toLowerCase().includes(stateFilter.toLowerCase())
      );

    if (districtFilter)
      result = result.filter((e) =>
        e.district
          ?.toLowerCase()
          .includes(districtFilter.toLowerCase())
      );

    setFiltered(result);
  }, [stateFilter, districtFilter, entities]);

  // 🔹 Fetch Requests
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/requests/user/${userId}`)
      .then((res) => setRequests(res.data))
      .catch(console.error);
  }, [userId]);

  const submitRequest = async () => {
    if (!selectedId || !userId) return;

    setLoadingIds((prev) => [...prev, selectedId]);

    try {
      await axios.post("http://localhost:5000/api/requests", {
        requesterId: userId,
        recipientId: selectedId,
        type: type,
        message: modalMessage,
      });

      alert("Request sent successfully ✅");
      setModalOpen(false);
      setModalMessage("");
    } catch {
      alert("Request failed ❌");
    } finally {
      setLoadingIds((prev) =>
        prev.filter((id) => id !== selectedId)
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Patient Requests
      </h2>

      {/* 🔥 Toggle */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setType("blood")}
          className={`px-4 py-2 rounded ${
            type === "blood"
              ? "bg-red-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Blood Banks
        </button>
        <button
          onClick={() => setType("organ")}
          className={`px-4 py-2 rounded ${
            type === "organ"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Organizations
        </button>
      </div>

      {/* 🔥 Filters + Voice */}
      <div className="flex gap-4 mb-6">
        <div className="flex w-1/2">
          <input
            type="text"
            placeholder="Filter by State"
            className="border p-2 rounded-l w-full"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          />
          <button
            onClick={() => startVoice("state")}
            className="bg-blue-600 text-white px-3 rounded-r"
          >
            {isListening ? "🎙" : "🎤"}
          </button>
        </div>

        <div className="flex w-1/2">
          <input
            type="text"
            placeholder="Filter by District"
            className="border p-2 rounded-l w-full"
            value={districtFilter}
            onChange={(e) =>
              setDistrictFilter(e.target.value)
            }
          />
          <button
            onClick={() => startVoice("district")}
            className="bg-blue-600 text-white px-3 rounded-r"
          >
            {isListening ? "🎙" : "🎤"}
          </button>
        </div>
      </div>

      {/* 🔥 Entity List */}
      <div className="grid gap-4 mb-8">
        {filtered.map((e) => (
          <div
            key={e._id}
            className="p-4 border rounded shadow flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{e.name}</h3>
              <p>
                {e.address}, {e.district}, {e.state}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedId(e._id);
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Make Request
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-xl font-semibold mb-4">
              Send Request
            </h3>
            <textarea
              className="w-full border p-2 rounded mb-4"
              placeholder="Requirement(unit and name)"
              value={modalMessage}
              onChange={(e) =>
                setModalMessage(e.target.value)
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                className="px-4 py-2 bg-green-600 text-white rounded"
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

export default PatientRequestCombined;
