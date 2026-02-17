import { JSX } from "react";

export default function HowItWorks(): JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-red-700">
          How It Works
        </h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Connecting patients, donors, and organizations seamlessly to ensure
          timely blood and organ availability.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-red-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Register
            </h3>
            <p className="text-gray-700">
              Patients, donors, and organizations create an account to get started.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-red-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Connect
            </h3>
            <p className="text-gray-700">
              Donors and organizations are matched with patients in need of blood or organs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-red-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Save Lives
            </h3>
            <p className="text-gray-700">
              Donations are approved and delivered efficiently, saving lives.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
