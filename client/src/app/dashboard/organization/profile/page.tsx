"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const OrganizationEditProfile = () => {
  const [organizationId, setOrganizationId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hospitalName: "",
    contactPerson: "",
    phone: "",
    website: "",
    address: "",
    state: "",
    district: "",
    googleMapLink: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Get logged-in user ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "organization") setOrganizationId(parsedUser.id);
    }
  }, []);

  // 🔹 Fetch organization profile
  useEffect(() => {
    if (!organizationId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${organizationId}`
        );
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          hospitalName: res.data.hospitalName || "",
          contactPerson: res.data.contactPerson || "",
          phone: res.data.phone || "",
          website: res.data.website || "",
          address: res.data.address || "",
          state: res.data.state || "",
          district: res.data.district || "",
          googleMapLink: res.data.googleMapLink || "",
          password: "",
        });
      } catch (err) {
        toast.error("Failed to load profile ❌");
      }
    };

    fetchProfile();
  }, [organizationId]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organizationId) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // don't update if blank

      const res = await axios.put(
        `http://localhost:5000/api/users/${organizationId}`,
        payload
      );

      // Update localStorage with new user data
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully ✅");
      setFormData((prev) => ({ ...prev, password: "" })); // clear password field
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!organizationId) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Organization not found
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold mb-6">
        Edit Organization Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Organization Name"
          className="w-full p-3 border rounded"
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          placeholder="New Password (leave blank to keep current)"
          className="w-full p-3 border rounded"
        />

        {/* ORGANIZATION DETAILS */}
        <input
          type="text"
          name="hospitalName"
          value={formData.hospitalName || ""}
          onChange={handleChange}
          placeholder="Hospital Name"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={handleChange}
          placeholder="Contact Person"
          className="w-full p-3 border rounded"
          required
          maxLength={10}
        />

        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-3 border rounded"
          required
          maxLength={10}
        />

        <input
          type="text"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          placeholder="Website"
          className="w-full p-3 border rounded"
          
        />

        {/* LOCATION */}
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          placeholder="District"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="googleMapLink"
          value={formData.googleMapLink || ""}
          onChange={handleChange}
          placeholder="Google Maps Link"
          className="w-full p-3 border rounded"
          required
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

export default OrganizationEditProfile;
