import { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage(): JSX.Element {
  return (
    <>
    <Navbar/>
      <main className="bg-red-50">
        {/* Hero / Banner */}
        <section className="relative w-full h-64 md:h-96 bg-red-700 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
            About BloodConnect
          </h1>
        </section>

        {/* Mission / Vision */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold text-red-700 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-6">
              BloodConnect exists to connect patients, donors, and organizations
              seamlessly, ensuring timely blood and organ availability to save
              lives.
            </p>

            <h2 className="text-3xl font-bold text-red-700 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To create a world where no patient waits for life-saving donations
              and every donor and organization can contribute effectively.
            </p>
          </div>

          {/* Image */}
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/cc.png" // Place in public/about-hero.webp
              alt="About BloodConnect"
              fill
              priority
              className="object-cover rounded-lg shadow"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-6">
              How It Works
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-12">
              BloodConnect connects three types of users: Patients who need
              blood or organs, Donors who can give, and Organizations managing
              donations and requests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-red-50 rounded-lg p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Patient
                </h3>
                <p className="text-gray-700">
                  Request blood or organ donations safely and quickly.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Donor
                </h3>
                <p className="text-gray-700">
                  Sign up to donate blood or organs and save lives.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Organization
                </h3>
                <p className="text-gray-700">
                  Manage donations and connect patients with donors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-red-700 text-white py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join BloodConnect Today
          </h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Whether you’re a patient, donor, or organization, your contribution
            can save lives.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/login/patient"
              className="bg-white text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-100 transition"
            >
              Patient Login
            </Link>
            <Link
              href="/login/donor"
              className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-700 transition"
            >
              Donor Login
            </Link>
            <Link
              href="/login/organization"
              className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-700 transition"
            >
              Organization Login
            </Link>
          </div>
        </section>
      </main>
        <Footer/>
    </>
  );
}
