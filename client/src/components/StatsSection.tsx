'use client'

import { useEffect, useState } from "react";

interface User {
  _id: string;
  role: string;
}

interface Stats {
  donors: number;
  patientsHelped: number;
  organizations: number;
  bloodBanks: number;
  savedLives: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users
        const usersRes = await fetch("http://localhost:5000/api/users");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const users: User[] = await usersRes.json();

        const donors = users.filter(u => u.role === "donor").length;
        const patientsHelped = users.filter(u => u.role === "patient").length;
        const organizations = users.filter(u => u.role === "organization").length;
        const bloodBanks = users.filter(u => u.role === "bloodBank").length;

        // Fetch all approved requests (saved lives)
        const requestsRes = await fetch("http://localhost:5000/api/requests/approved");
        if (!requestsRes.ok) throw new Error("Failed to fetch approved requests");
        const approvedRequests = await requestsRes.json();
        const savedLives = approvedRequests.length;

        setStats({ donors, patientsHelped, organizations, bloodBanks, savedLives });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center bg-red-700 text-white rounded-md p-6">
        <div>
          <h3 className="text-4xl font-bold">{stats?.donors.toLocaleString()}</h3>
          <p className="mt-1">Registered Donors</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold">{stats?.patientsHelped.toLocaleString()}</h3>
          <p className="mt-1">Registered Patients</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold">{stats?.organizations.toLocaleString()}</h3>
          <p className="mt-1">Organizations Connected</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold">{stats?.bloodBanks.toLocaleString()}</h3>
          <p className="mt-1">Blood Banks</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold">{stats?.savedLives.toLocaleString()}</h3>
          <p className="mt-1">Lives Saved</p>
        </div>
      </div>
    </div>
  );
}
