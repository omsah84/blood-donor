import Link from "next/link";
import { JSX } from "react";

export default function RolesSection(): JSX.Element {
  return (
    <section className="bg-red-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-red-700">
          Get Started
        </h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Whether you need blood, want to donate, or manage an organization, select your role to continue.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Patient */}
          <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Patient</h3>
            <p className="text-gray-700 mb-6">
              Request blood or organ donations for yourself or a loved one.
            </p>
            <Link
              href="/login/patient"
              className="bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800"
            >
              Patient Login
            </Link>
          </div>

          {/* Donor */}
          <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Donor</h3>
            <p className="text-gray-700 mb-6">
              Sign up to donate blood or organs and save lives.
            </p>
            <Link
              href="/login/donor"
              className="bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800"
            >
              Donor Login
            </Link>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Organization</h3>
            <p className="text-gray-700 mb-6">
              Manage donations and connect with patients and donors.
            </p>
            <Link
              href="/login/organization"
              className="bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800"
            >
              Organization Login
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
