import Link from "next/link";
import { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-red-800 text-white mt-1">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            🩸 DonorBridgeConnect
          </h2>
          <p className="text-sm mt-2 text-red-100">
            Connecting patients, donors, and organizations to save lives
            through blood and organ donation.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="space-y-1 text-sm text-red-100">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/why-donate" className="hover:text-white">Why Donate</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Login */}
        <div>
          <h3 className="font-semibold mb-2">Login</h3>
          <ul className="space-y-1 text-sm text-red-100">
            <li><Link href="/login/patient" className="hover:text-white">Patient</Link></li>
            <li><Link href="/login/donor" className="hover:text-white">Donor</Link></li>
            <li><Link href="/login/organization" className="hover:text-white">Organization</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-red-700 text-center text-xs py-3 text-red-100">
        © {new Date().getFullYear()} DonorBridgeConnect
      </div>
    </footer>
  );
}
