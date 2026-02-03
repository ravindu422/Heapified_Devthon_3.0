import React, { useState } from "react";
import { Bell, User, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AvailableTasks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  // Sample task data - will be replaced with backend data later
  const tasks = [
    {
      id: 1,
      priority: "medium",
      title: "Emergency Medical Assistance",
      location: "Kurunegala - Lake Round",
      contact: "+94 77 345 6791",
      contactPerson: "Mr. P. Samaraweera",
      expectedSupport: ["Basic treatment", "Basic medicines", "Patientriage"],
    },
    {
      id: 2,
      priority: "high",
      title: "Flood Evacuation Transport",
      location: "Welawa - Lowland Zone",
      contact: "+94 76 551 7709",
      contactPerson: "Ms. K. Perera",
      expectedSupport: [
        "Emergency medical supplies",
        "Assist elderly and children",
        "Coordinate evacuation routes",
      ],
    },
    {
      id: 3,
      priority: "low",
      title: "Temporary Shelter Setup",
      location: "Moladena - School Grounds",
      contact: "+94 77 452 8896",
      contactPerson: "Mr. R. Silva",
      expectedSupport: [
        "Set up tents",
        "Distribute food rations",
        "Secure shelter areas",
      ],
    },
    {
      id: 4,
      priority: "low",
      title: "Disaster Area Translation Support",
      location: "Mahawa - Emergency Relief Camp",
      contact: "+94 75 044 7872",
      contactPerson: "Mr. P. Mohamed",
      expectedSupport: [
        "Provide translation",
        "Assist communication with victims",
        "Help coordination injury information",
      ],
    },
    {
      id: 5,
      priority: "medium",
      title: "Mobile Medical Camp Support",
      location: "Dullewa - Flood Affected Area",
      contact: "+94 72 104 4491",
      contactPerson: "Dr. S. Jayasinghe",
      expectedSupport: [
        "Triage patients",
        "Medical documentation",
        "Support vaccinations & checkups",
      ],
    },
    {
      id: 6,
      priority: "medium",
      title: "Relief Supply Logistics Coordination",
      location: "Nikaweratiya - Distribution Center",
      contact: "+94 77 452 2399",
      contactPerson: "Mr. K. Nalulathra",
      expectedSupport: [
        "Manage incoming supplies",
        "Coordinate transport schedules",
        "Update stock records",
      ],
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return {
          border: "border-red-400",
          dot: "bg-red-500",
          text: "text-red-600",
        };
      case "medium":
        return {
          border: "border-yellow-400",
          dot: "bg-yellow-500",
          text: "text-yellow-600",
        };
      case "low":
        return {
          border: "border-green-400",
          dot: "bg-green-500",
          text: "text-green-600",
        };
      default:
        return {
          border: "border-gray-400",
          dot: "bg-gray-500",
          text: "text-gray-600",
        };
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1) + " Priority";
  };

  const handleAcceptTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleConfirmAccept = () => {
    // Here you would typically save the task to backend/local storage
    console.log("Task accepted:", selectedTask);
    setShowModal(false);
    navigate("/my-active-tasks");
  };

  const handleCancelAccept = () => {
    setShowModal(false);
    setSelectedTask(null);
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
                className="text-sm xl:text-base font-medium hover:text-teal-400 transition-colors duration-200"
              >
                Quick stats
              </a>
              <a
                href="/available-tasks"
                className="text-sm xl:text-base font-medium text-teal-400"
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
                  <span className="text-sm xl:text-base">Menul Kanute</span>
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
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-teal-400 hover:bg-gray-800 transition-colors duration-200"
              >
                Quick stats
              </a>
              <a
                href="/available-tasks"
                className="block px-3 py-2 rounded-md text-base font-medium text-teal-400 bg-gray-800"
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
            Recommended based on your skills and location
          </h1>

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-300">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Filter by Priority Type
              </span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-600"
              >
                <option value="all">Priority Type</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks
              .filter(
                (task) =>
                  priorityFilter === "all" || task.priority === priorityFilter,
              )
              .map((task) => {
                const colors = getPriorityColor(task.priority);
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-lg border-2 ${colors.border} p-6 shadow-sm flex flex-col`}
                  >
                    {/* Priority Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-2 h-2 rounded-full ${colors.dot}`}
                      ></div>
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {task.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin
                        size={16}
                        className="text-gray-600 mt-1 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        Location: {task.location}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="flex items-start gap-2 mb-2">
                      <Phone
                        size={16}
                        className="text-gray-600 mt-1 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        Contact: {task.contact}
                      </span>
                    </div>

                    {/* Contact Person */}
                    <div className="flex items-start gap-2 mb-4">
                      <User
                        size={16}
                        className="text-gray-600 mt-1 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        Contact Person: {task.contactPerson}
                      </span>
                    </div>

                    {/* Expected Support */}
                    <div className="mb-6 flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Expected Support:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {task.expectedSupport.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accept Task Button */}
                    <button
                      onClick={() => handleAcceptTask(task)}
                      className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Accept Task
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Task Acceptance
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to add this task to your active tasks?
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancelAccept}
                className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmAccept}
                className="flex-1 py-2 px-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableTasks;
