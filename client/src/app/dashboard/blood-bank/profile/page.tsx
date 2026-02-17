"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BloodBankEditProfile = () => {
  const [bloodBankId, setBloodBankId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    organizationId: "",
    address: "",
    state: "",
    district: "",
    googleMapLink: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Get blood bank ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === "bloodBank") setBloodBankId(parsed.id);
    }
  }, []);

  // 🔹 Fetch profile
  useEffect(() => {
    if (!bloodBankId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${bloodBankId}`);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
          phone: res.data.phone || "",
          website: res.data.website || "",
          organizationId: res.data.organizationId || "",
          address: res.data.address || "",
          state: res.data.state || "",
          district: res.data.district || "",
          googleMapLink: res.data.googleMapLink || "",
        });
      } catch {
        toast.error("Failed to load blood bank profile ❌");
      }
    };

    fetchProfile();
  }, [bloodBankId]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bloodBankId) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res = await axios.put(`http://localhost:5000/api/users/${bloodBankId}`, payload);

      // Update localStorage with new profile data
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Profile updated successfully ✅");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!bloodBankId) {
    return <p className="text-center mt-10 text-gray-500">Blood bank not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold mb-6">Edit Blood Bank Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 border rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          placeholder="New Password (leave blank to keep current)"
          className="w-full p-3 border rounded"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-3 border rounded"
        />

        {/* Website */}
        <input
          type="text"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          placeholder="Website"
          className="w-full p-3 border rounded"
        />

        {/* Organization ID */}
        <input
          type="text"
          name="organizationId"
          value={formData.organizationId || ""}
          onChange={handleChange}
          placeholder="Parent Organization Name"
          className="w-full p-3 border rounded"
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 border rounded"
        />

        {/* State */}
        <input
          type="text"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-3 border rounded"
        />

        {/* District */}
        <input
          type="text"
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          placeholder="District"
          className="w-full p-3 border rounded"
        />

        {/* Google Maps Link */}
        <input
          type="text"
          name="googleMapLink"
          value={formData.googleMapLink || ""}
          onChange={handleChange}
          placeholder="Google Maps Link"
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default BloodBankEditProfile;
