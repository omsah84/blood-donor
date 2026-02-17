"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const PatientEditProfile = () => {
  const [patientId, setPatientId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: undefined,
    gender: "",
    bloodGroup: "",
    organs: [],
    address: "",
    state: "",
    district: "",
    googleMapLink: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Get patient ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === "patient") setPatientId(parsed.id);
    }
  }, []);

  // 🔹 Fetch patient profile
  useEffect(() => {
    if (!patientId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${patientId}`);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
          phone: res.data.phone || "",
          age: res.data.age || undefined,
          gender: res.data.gender || "",
          bloodGroup: res.data.bloodGroup || "",
          organs: res.data.organs || [],
          address: res.data.address || "",
          state: res.data.state || "",
          district: res.data.district || "",
          googleMapLink: res.data.googleMapLink || "",
        });
      } catch {
        toast.error("Failed to load patient profile");
      }
    };

    fetchProfile();
  }, [patientId]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrgansChange = (e) => {
    const organsArray = e.target.value.split(",").map((o) => o.trim());
    setFormData({ ...formData, organs: organsArray });
  };

  // 🔹 Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res = await axios.put(`http://localhost:5000/api/users/${patientId}`, payload);

      // 🔹 Update localStorage with new profile data (including profileStatus)
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...res.data.user, // assuming your backend returns updated user data
        })
      );

      toast.success("Profile updated successfully ✅");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!patientId) return <p className="text-center mt-10 text-gray-500">Patient not found</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-semibold mb-6">Edit Patient Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
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
          required
        />

        {/* Age */}
        <input
          type="number"
          name="age"
          value={formData.age || ""}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-3 border rounded"
          required
        />

        {/* Gender */}
        <input
          type="text"
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          placeholder="Gender"
          className="w-full p-3 border rounded"
          required
        />

        {/* Blood Group */}
        <input
          type="text"
          name="bloodGroup"
          value={formData.bloodGroup || ""}
          onChange={handleChange}
          placeholder="Blood Group"
          className="w-full p-3 border rounded"
          required
        />

        {/* Organs */}
        <input
          type="text"
          name="organs"
          value={formData.organs.join(", ")}
          onChange={handleOrgansChange}
          placeholder="Organs (comma separated)"
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
          required
        />

        {/* State */}
        <input
          type="text"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-3 border rounded"
          required
        />

        {/* District */}
        <input
          type="text"
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          placeholder="District"
          className="w-full p-3 border rounded"
          required
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

export default PatientEditProfile;
