import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="shrink-0">
            <a href="/" className="text-xl sm:text-2xl lg:text-3xl font-bold">
              SafeLanka
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/safe-zones"
              className={`text-sm xl:text-base font-medium transition-colors duration-200 ${
                location.pathname === '/safe-zones'
                  ? 'text-teal-500'
                  : 'hover:text-teal-400'
              }`}
            >
              Find Safe Zone
            </Link>
            <Link
              to="/crisis-map"
              className={`text-sm xl:text-base font-medium transition-colors duration-200 ${
                location.pathname === '/crisis-map'
                  ? 'text-teal-500'
                  : 'hover:text-teal-400'
              }`}
            >
              View Crisis Map
            </Link>
            <Link
              to="/resources"
              className={`text-sm xl:text-base font-medium transition-colors duration-200 ${
                location.pathname === '/resources'
                  ? 'text-teal-500'
                  : 'hover:text-teal-400'
              }`}
            >
              Resources Availability
            </Link>
            <Link
              to="/volunteer-dashboard"
              className={`text-sm xl:text-base font-medium transition-colors duration-200 ${
                location.pathname === '/volunteer-dashboard'
                  ? 'text-teal-500'
                  : 'hover:text-teal-400'
              }`}
            >
              Volunteer SignUp
            </Link>
            <Link
              to="/updates"
              className={`text-sm xl:text-base font-medium transition-colors duration-200 ${
                location.pathname === '/updates'
                  ? 'text-teal-500'
                  : 'hover:text-teal-400'
              }`}
            >
              Updates
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-teal-400 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors duration-200"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
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
                /* Close Icon */
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

        {/* Mobile Menu - Now outside the flex container */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/safe-zones"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === '/safe-zones'
                    ? 'text-teal-500 bg-gray-900'
                    : 'hover:text-teal-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Find Safe Zone
              </Link>
              <Link
                to="/crisis-map"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === '/crisis-map'
                    ? 'text-teal-500 bg-gray-900'
                    : 'hover:text-teal-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                View Crisis Map
              </Link>
              <Link
                to="/resources"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === '/resources'
                    ? 'text-teal-500 bg-gray-900'
                    : 'hover:text-teal-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources Availability
              </Link>
              <Link
                to="/volunteer-dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === '/volunteer-dashboard'
                    ? 'text-teal-500 bg-gray-900'
                    : 'hover:text-teal-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Volunteer SignUp
              </Link>
              <Link
                to="/updates"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === '/updates'
                    ? 'text-teal-500 bg-gray-900'
                    : 'hover:text-teal-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Updates
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;