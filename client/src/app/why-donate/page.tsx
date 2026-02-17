import { JSX } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function WhyDonatePage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="bg-red-50">
        {/* Hero / Banner */}
        <section className="relative w-full h-64 md:h-96 bg-red-700 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
            Why Donate Blood & Organs
          </h1>
        </section>

        {/* Introduction */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-red-700 mb-6">
            Make a Life-Saving Impact
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12">
            Every donation can save lives. Blood and organ donors provide
            patients with the resources they need to survive and thrive. Your
            small act can make a big difference.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Save Lives
              </h3>
              <p className="text-gray-700">
                One blood donation can save up to three lives, and organ
                donations give patients a second chance at life.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Health Benefits
              </h3>
              <p className="text-gray-700">
                Donating blood helps maintain healthy iron levels and encourages
                a healthy lifestyle.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Community Impact
              </h3>
              <p className="text-gray-700">
                Your donation strengthens the community and inspires others to
                give, creating a ripple effect of hope.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-red-700 text-white py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Become a donor today and help save lives. Every contribution counts.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/login/donor"
              className="bg-white text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-100 transition"
            >
              Donate Blood / Organs
            </Link>
            <Link
              href="/login/patient"
              className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-700 transition"
            >
              Request Help
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
