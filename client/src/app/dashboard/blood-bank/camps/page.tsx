"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Camp {
  _id: string;
  name: string;
  address: string;
  state?: string;
  district?: string;
  googleMapLink?: string;
  date: string;
  time: string;
  description?: string;
}

export default function CampsPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    address: "",
    state: "",
    district: "",
    googleMapLink: "",
    date: "",
    time: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCamps = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/camps");
      setCamps(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch camps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update camp
        const res = await axios.put(`http://localhost:5000/api/camps/${editingId}`, form);
        toast.success(res.data.message || "Camp updated successfully");
        setEditingId(null);
      } else {
        // Create new camp
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await axios.post("http://localhost:5000/api/camps", {
          ...form,
          createdBy: user.id,
        });
        toast.success(res.data.message || "Camp created successfully");
      }
      setForm({
        name: "",
        address: "",
        state: "",
        district: "",
        googleMapLink: "",
        date: "",
        time: "",
        description: "",
      });
      fetchCamps();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (camp: Camp) => {
    setEditingId(camp._id);
    setForm({
      name: camp.name,
      address: camp.address,
      state: camp.state || "",
      district: camp.district || "",
      googleMapLink: camp.googleMapLink || "",
      date: camp.date.slice(0, 10), // format YYYY-MM-DD
      time: camp.time,
      description: camp.description || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this camp?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/camps/${id}`);
      toast.success(res.data.message || "Camp deleted successfully");
      fetchCamps();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete camp");
    }
  };

  if (loading) return <p>Loading camps...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-bold text-red-700 mb-6">Manage Camps</h1>

      {/* Camp Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? "Update Camp" : "Create New Camp"}</h2>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Camp Name"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <div className="flex gap-4">
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="District"
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <input
          type="text"
          name="googleMapLink"
          value={form.googleMapLink}
          onChange={handleChange}
          placeholder="Google Map Link"
          className="w-full border px-4 py-2 rounded"
        />
        <div className="flex gap-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Time (e.g., 10:00 AM - 4:00 PM)"
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-red-700 text-white py-2 px-6 rounded hover:bg-red-800"
        >
          {editingId ? "Update Camp" : "Create Camp"}
        </button>
      </form>

      {/* Camps List */}
      <div className="grid md:grid-cols-2 gap-4">
        {camps.map((camp) => (
          <div key={camp._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">{camp.name}</h3>
            <p>{camp.address} {camp.district && `, ${camp.district}`} {camp.state && `, ${camp.state}`}</p>
            {camp.googleMapLink && (
              <a href={camp.googleMapLink} target="_blank" className="text-blue-500 underline">View Map</a>
            )}
            <p>Date: {new Date(camp.date).toLocaleDateString()}</p>
            <p>Time: {camp.time}</p>
            {camp.description && <p className="italic">{camp.description}</p>}

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(camp)}
                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(camp._id)}
                className="bg-red-700 text-white py-1 px-3 rounded hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
