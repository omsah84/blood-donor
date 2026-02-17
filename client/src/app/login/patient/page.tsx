"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PatientAuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(true);

  const [form, setForm] = useState({
    name: "",
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const payload = isSignup
        ? {
            name: form.name,
            email: form.emailOrPhone.includes("@")
              ? form.emailOrPhone
              : undefined,
            phone: !form.emailOrPhone.includes("@")
              ? form.emailOrPhone
              : undefined,
            password: form.password,
            role: "patient",
          }
        : {
            emailOrPhone: form.emailOrPhone,
            password: form.password,
            role: "patient",
          };

      const res = await axios.post(url, payload);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard/patient");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-red-100">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">
          {isSignup ? "Patient Signup" : "Patient Login"}
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
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
            onChange={(e) => {
              const value = e.target.value;

              // If numeric → restrict to 10 digits
              if (/^\d*$/.test(value)) {
                if (value.length <= 10) {
                  setForm({ ...form, emailOrPhone: value });
                  setError(
                    value.length === 10
                      ? ""
                      : value.length > 0
                        ? "Phone number must be exactly 10 digits"
                        : "",
                  );
                }
              } else {
                // If not numeric → treat as email
                setForm({ ...form, emailOrPhone: value });

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setError(
                  value && !emailRegex.test(value)
                    ? "Please enter a valid email address"
                    : "",
                );
              }
            }}
            maxLength={/^\d+$/.test(form.emailOrPhone) ? 10 : undefined}
            className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:outline-none transition
    ${
      error
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-red-400"
    }
  `}
            required
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

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
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
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
