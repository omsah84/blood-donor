"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DonorNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard/donor", requiresProfile: false },
    { name: "Update Profile", path: "/dashboard/donor/profile", requiresProfile: false },
    { name: "My Donations", path: "/dashboard/donor/donations", requiresProfile: true },
    { name: "Blood Requests", path: "/dashboard/donor/blood-requests", requiresProfile: true },
    { name: "Organ Requests", path: "/dashboard/donor/organ-requests", requiresProfile: true },
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setProfileStatus(parsed.profileStatus || "Incomplete");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login/donor");
  };

  const handleClick = (requiresProfile: boolean, path: string) => {
    if (requiresProfile && profileStatus !== "Completed") {
      toast.error("Please complete your profile to access this page!");
      return;
    }
    router.push(path);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <nav className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-bold text-xl">🩸 Donor Panel</div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {menu.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleClick(item.requiresProfile, item.path)}
                  className={`px-3 py-2 rounded ${
                    pathname === item.path ? "bg-green-800" : "hover:bg-green-600"
                  }`}
                >
                  {item.name}
                </button>
              ))}

              <button
                onClick={logout}
                className="px-3 py-2 rounded hover:bg-green-600"
              >
                Logout
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-green-700">
            {menu.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  handleClick(item.requiresProfile, item.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-green-600`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded hover:bg-green-600"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
