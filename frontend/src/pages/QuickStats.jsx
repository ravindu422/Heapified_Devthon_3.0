import React, { useState, useEffect, useRef } from "react";
import { Bell, User, CheckCircle, Clock, Star, MapPin } from "lucide-react";

const QuickStats = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const username = localStorage.getItem("username") || "Unknown user";
  const userEmail = localStorage.getItem("userEmail") || "user@email.com";

  // Dummy notification data
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
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  // Dummy stats values - will reset on page refresh
  const stats = {
    completedTasks: 2,
    hoursContributed: 16,
    impactScore: 24,
  };

  const handleNotificationClick = (notificationId) => {
    // Mark notification as read
    if (!readNotifications.includes(notificationId)) {
      setReadNotifications([...readNotifications, notificationId]);
    }
    // Navigate to Available Tasks
    window.location.href = "/available-tasks";
  };

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
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {importantNotifications.filter(
                        (n) => !readNotifications.includes(n.id),
                      ).length + moreNotifications.length}
                    </span>
                  </button>

                  {showNotifications && (
                    <div
                      ref={notificationRef}
                      className="absolute right-0 mt-2 w-[400px] bg-white rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto"
                    >
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

                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm text-gray-700">
                          Get notified when a new task matches your skills and
                          location
                        </p>
                      </div>

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
                              className={`rounded-lg p-4 cursor-pointer hover:opacity-80 transition-opacity ${
                                readNotifications.includes(notification.id)
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

                  {showProfileDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 py-4"
                    >
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

                      <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-3">
                          <User size={32} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Hi, {username}!
                        </h3>
                        <p className="text-sm text-gray-600">{userEmail}</p>
                      </div>

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
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
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
                <p className="text-4xl font-bold text-teal-600">
                  {stats.completedTasks}
                </p>
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
                <p className="text-4xl font-bold text-teal-600">
                  {stats.hoursContributed}h
                </p>
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
                <p className="text-4xl font-bold text-teal-600">
                  {stats.impactScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
