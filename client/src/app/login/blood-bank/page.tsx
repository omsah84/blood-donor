"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function BloodBankAuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(true);

  const [form, setForm] = useState({
    name: "",
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const payload = isSignup
        ? {
            name: form.name,
            email: form.emailOrPhone.includes("@") ? form.emailOrPhone : undefined,
            phone: !form.emailOrPhone.includes("@") ? form.emailOrPhone : undefined,
            password: form.password,
            role: "bloodBank",
          }
        : {
            emailOrPhone: form.emailOrPhone,
            password: form.password,
            role: "bloodBank",
          };

      const res = await axios.post(url, payload);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || (isSignup ? "Signup successful!" : "Login successful!"));

      router.push("/dashboard/blood-bank");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-red-100">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">
          {isSignup ? "Blood Bank Signup" : "Blood Bank Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Blood Bank Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              required
            />
          )}

          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or Phone Number"
            value={form.emailOrPhone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-600">
          {isSignup
            ? "Already registered?"
            : "New blood bank?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-red-700 font-semibold hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
