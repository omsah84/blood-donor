"use client";

import { JSX, useState } from "react";
import Link from "next/link";

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  return (
    <nav className="bg-red-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          🩸 BloodConnect
        </Link>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle Menu"
          className="md:hidden text-2xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Menu */}
        <ul
          className={`md:flex md:items-center md:gap-6 absolute md:static left-0 w-full md:w-auto bg-red-800 md:bg-transparent transition-all duration-300
          ${open ? "top-16" : "top-[-400px]"}`}
        >
          {/* Public Links */}
              <li>
            <Link
              href="/"
              className="block px-6 py-3 hover:bg-red-600 md:hover:bg-transparent"
            >
              Home
            </Link>
          </li>
              <li>
            <Link
              href="/camps"
              className="block px-6 py-3 hover:bg-red-600 md:hover:bg-transparent"
            >
              Camps
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block px-6 py-3 hover:bg-red-600 md:hover:bg-transparent"
            >
              About Us
            </Link>
          </li>
      

          <li>
            <Link
              href="/why-donate"
              className="block px-6 py-3 hover:bg-red-600 md:hover:bg-transparent"
            >
              Why Donate
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className="block px-6 py-3 hover:bg-red-600 md:hover:bg-transparent"
            >
              Contact Us
            </Link>
          </li>

          {/* Login Dropdown */}
          <li className="relative px-6 py-3 md:p-0">
            <button
              aria-haspopup="true"
              aria-expanded={loginOpen}
              onClick={() => setLoginOpen((prev) => !prev)}
              className="bg-white text-red-700 font-semibold px-5 py-2 rounded-full w-full md:w-auto"
            >
              Login
            </button>

            {loginOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-red-700 rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/login/patient"
                  className="block px-4 py-3 hover:bg-red-100"
                >
                  Patient Login
                </Link>
                <Link
                  href="/login/organization"
                  className="block px-4 py-3 hover:bg-red-100"
                >
                  Organization Login
                </Link>
                <Link
                  href="/login/donor"
                  className="block px-4 py-3 hover:bg-red-100"
                >
                  Donor Login
                </Link>
                <Link
                  href="/login/blood-bank"
                  className="block px-4 py-3 hover:bg-red-100"
                >
                  Blood Bank Login
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
