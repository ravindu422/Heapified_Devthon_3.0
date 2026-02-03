import React, { useState, useEffect, useRef } from "react";
import { Bell, User, MapPin } from "lucide-react";

const MyActiveTasks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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

  // Sample active tasks data - will be replaced with backend data later
  const activeTasks = [
    {
      id: 1,
      title: "Flood Relief Medical Assistance",
      description:
        "Providing basic medical care and first aid to people affected by flooding. Supporting doctors, treating minor injuries, and helping manage patients at the relief site",
      status: "available",
      date: "13.01.2026",
      statusColor: "yellow",
    },
    {
      id: 2,
      title: "Temporary Shelter Setup",
      description:
        "Assisting in setting up temporary shelters for displaced families. Helping with tents, basic structures, and ensuring safe and organized shelter spaces",
      status: "active",
      date: "10.01.2026",
      statusColor: "red",
    },
    {
      id: 3,
      title: "Emergency Food Packing & Distribution Support",
      description:
        "Assisted in packing, sorting, and distributing food supplies for affected families. Helped ensure food items were prepared efficiently and delivered in an organized and timely manner",
      status: "completed",
      date: "14.12.2025",
      statusColor: "red",
    },
    {
      id: 4,
      title: "Relief Supply Logistics Coordination",
      description:
        "Supported the coordination and tracking of relief supplies at a distribution center. Helped organize incoming resources, update stock records, and assist with dispatching supplies to affected areas",
      status: "completed",
      date: "02.12.2025",
      statusColor: "green",
    },
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "available":
        return "border-yellow-500 text-yellow-600 bg-white";
      case "active":
        return "border-red-500 text-red-600 bg-white";
      case "completed":
        return "border-green-500 text-green-600 bg-white";
      default:
        return "border-gray-500 text-gray-600 bg-white";
    }
  };

  const getDotColor = (statusColor) => {
    switch (statusColor) {
      case "yellow":
        return "bg-yellow-500";
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredTasks = activeTasks.filter(
    (task) => statusFilter === "all" || task.status === statusFilter,
  );

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
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
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
                className="text-sm xl:text-base font-medium text-teal-400"
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
                      {importantNotifications.length + moreNotifications.length}
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
                              className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4"
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
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-teal-400 bg-gray-800"
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
            Tasks you have accepted and are currently working on
          </h1>

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-300">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Filter by Status
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-600"
              >
                <option value="all">Status</option>
                <option value="available">Available</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              <div className="col-span-6">Title</div>
              <div className="col-span-3 text-center">Status</div>
              <div className="col-span-3 text-center">Date</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Title Column */}
                  <div className="col-span-6">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getDotColor(task.statusColor)} mt-1 flex-shrink-0`}
                      ></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Column */}
                  <div className="col-span-3 flex items-center justify-center">
                    <span
                      className={`px-6 py-2 border-2 rounded-full text-sm font-medium ${getStatusBadgeColor(task.status)}`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>

                  {/* Date Column */}
                  <div className="col-span-3 flex items-center justify-center">
                    <span className="text-gray-700">{task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActiveTasks;
