import React, { useState } from "react";
import { Bell, User } from "lucide-react";

const MyActiveTasks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

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
                  <span className="text-sm xl:text-base">Nimal Kumara</span>
                </a>
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
