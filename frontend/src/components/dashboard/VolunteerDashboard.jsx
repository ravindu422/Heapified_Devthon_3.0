import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import Footer from "../common/Footer";

const VolunteerDashboard = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    availability: "",
    skills: "",
    experience: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This will be replaced with actual user data from backend
  // For now, check localStorage or use a placeholder
  const username = localStorage.getItem("username") || null; // Will be null for new users

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Volunteer Dashboard Navbar - Same style as main navbar */}
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="shrink-0">
              <a href="/" className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Volunteer Dashboard
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a
                href="/"
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/quick-stats"
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                Quick Stats
              </a>
              <a
                href="/available-tasks"
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                Available Tasks
              </a>
              <a
                href="/my-active-tasks"
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                My Active Tasks
              </a>

              {/* Icons Section */}
              <div className="flex items-center space-x-4 ml-4">
                <a
                  href="#"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  <Bell size={20} />
                </a>
                <a
                  href="/volunteer-signup"
                  className="flex items-center space-x-2 hover:text-teal-400 transition-colors duration-200"
                >
                  <User size={20} />
                  <span className="text-sm xl:text-base">Unknown user</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-teal-400 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black">
              <a
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/quick-stats"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                Quick stats
              </a>
              <a
                href="/available-tasks"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                Available Tasks
              </a>
              <a
                href="/my-active-tasks"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                My Active Tasks
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Background Image */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('/volunteer_registration.avif')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex flex-col items-start justify-center text-white px-8 md:px-16 max-w-7xl">
          {username ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-left">
                Welcome back, {username}
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-left">
                Thank you for supporting
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-left">
                to the SafeLanka community
              </h2>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-left">
                Thank you for supporting
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-left">
                to the SafeLanka community
              </h2>
            </>
          )}
          <p className="mt-6 text-xl text-left">
            New Volunteer?{" "}
            <a
              href="/volunteer-signup"
              className="underline cursor-pointer hover:text-teal-400 transition-colors"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
