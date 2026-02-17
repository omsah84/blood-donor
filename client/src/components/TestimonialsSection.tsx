import { JSX } from "react";

interface Testimonial {
  name: string;
  role: string;
  message: string;
}

const testimonials: Testimonial[] = [
  {
    name: "John Doe",
    role: "Patient",
    message:
      "Thanks to BloodConnect, I received a blood transfusion on time. Truly life-saving!",
  },
  {
    name: "Jane Smith",
    role: "Donor",
    message:
      "Becoming a donor was easy. I feel proud to have saved lives through this platform.",
  },
  {
    name: "City Hospital",
    role: "Organization",
    message:
      "BloodConnect helps us manage donations efficiently and connect with patients in need.",
  },
];

export default function TestimonialsSection(): JSX.Element {
  return (
    <section className="bg-red-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-red-700">
          What People Say
        </h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto mb-12">
          Hear from patients, donors, and organizations who use BloodConnect.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <p className="text-gray-700 mb-4 text-center">&quot;{t.message}&quot;</p>
              <h4 className="text-red-700 font-semibold text-center">{t.name}</h4>
              <span className="text-gray-500 text-sm text-center">{t.role}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
