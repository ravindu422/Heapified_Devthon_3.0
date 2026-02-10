import React, { useState, useEffect, useRef } from "react";
import { Bell, User, MapPin } from "lucide-react";
import Footer from "../common/Footer";
import { useUser } from "../../contexts/UserContext.jsx";

const VolunteerDashboard = () => {
  const { user, logout, isAuthenticated } = useUser();
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Get user display name and email from UserContext
  const username = isAuthenticated && user?.fullName ? user.fullName : "Unknown user";
  const userEmail = isAuthenticated && user?.email ? user.email : "user@email.com";
  const isReturningUser = isAuthenticated;

  // Dummy notification data - will be replaced with backend data
  const importantNotifications = [
    {
      id: 1,
      title:
        "Flood Relief Medical Assistance - Location: Kurunegala - Lake Round",
      support: [
        "First aid treatment",
        "Basic medicines",
        "Patient triage support",
      ],
      updated: "2 Min ago",
    },
    {
      id: 2,
      title: "Flood Evacuation Transport - Wahara - Lowland Zone",
      support: [
        "Drive evacuation vehicles",
        "Transport affected families",
        "Assist elderly and children",
        "Coordinate evacuation routes",
      ],
      updated: "30 Min ago",
    },
  ];

  const moreNotifications = [
    {
      id: 3,
      title: "Temporary Shelter Setup - Mathawa- School Grounds",
      support: [
        "Set up tents",
        "Build temporary partitions",
        "Secure shelter areas",
      ],
      updated: "1 hour ago",
    },
    {
      id: 4,
      title: "Disaster Area Translation Support - Kuriyampola - Relief Camp",
      support: [
        "Translate instructions",
        "Assist communication with victims",
        "Help coordinators relay information",
      ],
      updated: "2 hour ago",
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    if (showProfileDropdown || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown, showNotifications]);

  const handleSignOut = () => {
    logout();
    window.location.href = "/";
  };

  const handleNotificationClick = (notificationId) => {
    // Mark notification as read
    if (!readNotifications.includes(notificationId)) {
      setReadNotifications([...readNotifications, notificationId]);
    }
    // Navigate to Available Tasks
    window.location.href = "/available-tasks";
  };

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
              <div className="flex items-center space-x-6 xl:space-x-8">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="hover:text-teal-400 transition-colors duration-200 relative"
                  >
                    <Bell size={20} />
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {importantNotifications.filter(
                        (n) => !readNotifications.includes(n.id),
                      ).length + moreNotifications.length}
                    </span>
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div
                      ref={notificationRef}
                      className="absolute right-0 mt-2 w-[400px] bg-white rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* Header */}
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm text-gray-700">
                          Get notified when a new task matches your skills and
                          location
                        </p>
                      </div>

                      {/* Important Section */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-3">
                          Important
                        </h3>
                        <div className="space-y-3">
                          {importantNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() =>
                                handleNotificationClick(notification.id)
                              }
                              className={`rounded-lg p-4 cursor-pointer hover:opacity-80 transition-opacity ${readNotifications.includes(notification.id)
                                ? "border border-gray-300 bg-gray-50"
                                : "border-2 border-blue-300 bg-blue-50"
                                }`}
                            >
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                {notification.title}
                              </h4>
                              <div className="mb-2">
                                <p className="text-xs text-gray-700 font-medium">
                                  Expected Support:
                                </p>
                                <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                                  {notification.support.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <p className="text-xs text-gray-500">
                                Updated {notification.updated}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* More notifications Section */}
                      <div className="p-4 pt-0">
                        <h3 className="font-bold text-gray-900 mb-3">
                          More notifications
                        </h3>
                        <div className="space-y-3">
                          {moreNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="border border-gray-300 bg-gray-50 rounded-lg p-4"
                            >
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                {notification.title}
                              </h4>
                              <div className="mb-2">
                                <p className="text-xs text-gray-700 font-medium">
                                  Expected Support:
                                </p>
                                <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                                  {notification.support.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <p className="text-xs text-gray-500">
                                Updated {notification.updated}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 hover:text-teal-400 transition-colors duration-200"
                  >
                    <User size={20} />
                    <span className="text-sm xl:text-base">{username}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 py-4"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setShowProfileDropdown(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* User Avatar */}
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-3">
                          <User size={32} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Hi, {username}!
                        </h3>
                        <p className="text-sm text-gray-600">{userEmail}</p>
                      </div>

                      {/* Buttons */}
                      <div className="px-4 space-y-2">
                        <a
                          href="/volunteer-signup"
                          className="block w-full py-2 px-4 text-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Your profile
                        </a>
                        <button
                          onClick={handleSignOut}
                          className="block w-full py-2 px-4 text-center bg-gray-200 text-red-600 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
          {!isAuthenticated && (
            <p className="mt-6 text-xl text-left">
              New Volunteer?{" "}
              <a
                href="/volunteer-signup"
                className="underline cursor-pointer hover:text-teal-400 transition-colors"
              >
                Sign up here
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Recent Notices Section - Only for authenticated users */}
      {isAuthenticated && user && user.fullName && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Recent Notices
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notice Card 1 */}
            <div
              onClick={() => window.location.href = "/available-tasks"}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Flood Relief Medical Assistance
              </h3>
              <div className="flex items-center text-base text-gray-600 mb-4">
                <MapPin size={18} className="mr-2" />
                <span>Katugoda - Low level</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                  Medium Priority
                </span>
                <span className="text-sm text-gray-500">
                  Updated 1 Min. ago
                </span>
              </div>
            </div>

            {/* Notice Card 2 */}
            <div
              onClick={() => window.location.href = "/available-tasks"}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Flood Evacuation Transport
              </h3>
              <div className="flex items-center text-base text-gray-600 mb-4">
                <MapPin size={18} className="mr-2" />
                <span>Moanakada - Mirissa</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                  High Priority
                </span>
                <span className="text-sm text-gray-500">
                  Updated 10 Min. ago
                </span>
              </div>
            </div>

            {/* Notice Card 3 */}
            <div
              onClick={() => window.location.href = "/available-tasks"}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Temporary Shelter Setup
              </h3>
              <div className="flex items-center text-base text-gray-600 mb-4">
                <MapPin size={18} className="mr-2" />
                <span>Diyatha</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  Low Priority
                </span>
                <span className="text-sm text-gray-500">
                  Updated 17 Min. ago
                </span>
              </div>
            </div>

            {/* Notice Card 4 */}
            <div
              onClick={() => window.location.href = "/available-tasks"}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Disaster Area Translation Support
              </h3>
              <div className="flex items-center text-base text-gray-600 mb-4">
                <MapPin size={18} className="mr-2" />
                <span>Beli Oya</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  Low Priority
                </span>
                <span className="text-sm text-gray-500">
                  Updated 8 Min. ago
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VolunteerDashboard;
