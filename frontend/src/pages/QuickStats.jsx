import React, { useState } from "react";
import { Bell, User, CheckCircle, Clock, Star } from "lucide-react";

const QuickStats = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Volunteer Dashboard Navbar */}
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="shrink-0">
              <a
                href="/volunteer-dashboard"
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
              >
                Volunteer Dashboard
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a
                href="/volunteer-dashboard"
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/quick-stats"
                className="text-sm xl:text-base font-medium text-teal-400"
              >
                Quick stats
              </a>
              <a
                href="#"
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                Available Tasks
              </a>
              <a
                href="#"
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
                href="/volunteer-dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/quick-stats"
                className="block px-3 py-2 rounded-md text-base font-medium text-teal-400 bg-gray-800"
              >
                Quick stats
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                Available Tasks
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                My Active Tasks
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-12">
            Summary of your volunteer contribution
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Tasks Completed Card */}
            <div className="bg-white rounded-lg border-2 border-teal-400 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tasks Completed
                </h2>
                <div className="bg-green-500 rounded p-2">
                  <CheckCircle className="text-white" size={24} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-400">-</p>
              </div>
            </div>

            {/* Hours Contributed Card */}
            <div className="bg-white rounded-lg border-2 border-teal-400 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Hours Contributed
                </h2>
                <div className="bg-white rounded p-2">
                  <Clock className="text-red-500" size={24} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-400">-</p>
              </div>
            </div>
          </div>

          {/* Impact Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border-2 border-teal-400 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Impact Score
                </h2>
                <div className="bg-white rounded p-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-400">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
