import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { JSX } from "react";

export default function ContactPage(): JSX.Element {
  return (
    <>
      <Navbar />

      <main className="bg-red-50">
        {/* Hero / Banner */}
        <section className="relative w-full h-64 md:h-96 bg-red-700 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
            Contact Us
          </h1>
        </section>

        {/* Contact Info & Form */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-red-700 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-700 mb-4">
              Have questions or need help? Reach out to our team and we’ll
              respond as soon as possible.
            </p>

            <div className="mt-6 space-y-4 text-gray-700">
              <p>
                <strong>Email:</strong> support@bloodconnect.com
              </p>
              <p>
                <strong>Phone:</strong> +1 234 567 890
              </p>
              <p>
                <strong>Address:</strong> 123 Donation Street, City, Country
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your Message"
                  rows={4}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
