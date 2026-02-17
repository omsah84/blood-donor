"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Camp {
  _id: string;
  name: string;
  createdBy: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  };
  address: string;
  state?: string;
  district?: string;
  googleMapLink?: string;
  date: string;
  time: string;
  description?: string;
}

export default function AllCampsPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCamps = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/camps");
      setCamps(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch camps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  if (loading) return <p>Loading camps...</p>;

  return (
    <>
    
   <Navbar/>
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">All Camps</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {camps.map((camp) => (
          <div key={camp._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{camp.name}</h2>
            <p className="text-gray-700">
              <strong>Created By:</strong> {camp.createdBy.name} ({camp.createdBy.role}){" "}
              {camp.createdBy.email && `| Email: ${camp.createdBy.email}`}{" "}
              {camp.createdBy.phone && `| Phone: ${camp.createdBy.phone}`}
            </p>
            <p className="mt-1">
              <strong>Address:</strong> {camp.address}
              {camp.district && `, ${camp.district}`}
              {camp.state && `, ${camp.state}`}
            </p>
            {camp.googleMapLink && (
              <p>
                <a
                  href={camp.googleMapLink}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  View on Map
                </a>
              </p>
            )}
            <p className="mt-1">
              <strong>Date:</strong> {new Date(camp.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {camp.time}
            </p>
            {camp.description && (
              <p className="italic mt-1">
                <strong>Description:</strong> {camp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer/>
     </>
  );
}
