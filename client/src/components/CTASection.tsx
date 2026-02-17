import Link from "next/link";
import { JSX } from "react";

export default function CTASection(): JSX.Element {
  return (
    <section className="bg-red-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Make a Difference?
        </h2>
        <p className="mt-4 text-red-100 max-w-2xl mx-auto">
          Join BloodConnect today as a patient, donor, or organization and help save lives.
        </p>

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/login/patient"
            className="bg-white text-red-700 font-semibold px-6 py-3 rounded-full hover:bg-red-100 transition"
          >
            Request Blood / Organ
          </Link>

          <Link
            href="/login/donor"
            className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-red-700 transition"
          >
            Become a Donor
          </Link>

          <Link
            href="/login/organization"
            className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-red-700 transition"
          >
            Register Organization
          </Link>
        </div>

      </div>
    </section>
  );
}
