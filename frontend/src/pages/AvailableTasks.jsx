import React, { useState, useEffect, useRef } from "react";
import { Bell, User, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

const AvailableTasks = () => {
  const { user, logout, isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const [tasks, setTasks] = useState([]); // Replace hardcoded tasks with state
  const [acceptedTaskIds, setAcceptedTaskIds] = useState([]); // Track accepted tasks
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Get user display name and email from UserContext
  const username = isAuthenticated && user?.fullName ? user.fullName : "Unknown user";
  const userEmail = isAuthenticated && user?.email ? user.email : "user@email.com";
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tasks from the backend and user's accepted tasks
    const fetchTasksAndAccepted = async () => {
      try {
        // Fetch available tasks
        const tasksResponse = await fetch("http://localhost:5080/api/tasks");
        if (!tasksResponse.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks);

        // Fetch user's accepted tasks
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const user = JSON.parse(loggedInUser);
          const acceptedResponse = await fetch(`http://localhost:5080/api/tasks/my-active/${user.id}`);

          if (acceptedResponse.ok) {
            const acceptedData = await acceptedResponse.json();
            // Extract originalTaskId from accepted tasks (this matches the sample task IDs)
            const acceptedIds = acceptedData.tasks
              .filter(task => task.originalTaskId) // Only include tasks with originalTaskId
              .map(task => task.originalTaskId);
            setAcceptedTaskIds(acceptedIds);
            console.log('Accepted task IDs:', acceptedIds);
          }
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasksAndAccepted();
  }, []);

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
    logout();
    window.location.href = "/";
  };

  const handleNotificationClick = (notificationId) => {
    // Mark notification as read
    if (!readNotifications.includes(notificationId)) {
      setReadNotifications([...readNotifications, notificationId]);
    }
    // Close the notification dropdown
    setShowNotifications(false);
  };

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

  const handleConfirmAccept = async () => {
    try {
      // Get current user from localStorage
      const loggedInUser = localStorage.getItem('loggedInUser');
      console.log('AvailableTasks: Logged in user:', loggedInUser);

      if (!loggedInUser) {
        alert('Please log in to accept tasks');
        return;
      }

      const user = JSON.parse(loggedInUser);
      console.log('AvailableTasks: User data:', user);
      console.log('AvailableTasks: Accepting task:', selectedTask);

      // Call backend to accept task
      const response = await fetch('http://localhost:5080/api/tasks/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: selectedTask.id,
          userId: user.id
        })
      });

      const data = await response.json();
      console.log('AvailableTasks: Backend response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept task');
      }

      console.log('Task accepted successfully:', data);

      // Add the task ID to accepted tasks list to remove it from available tasks
      setAcceptedTaskIds(prev => [...prev, selectedTask.id]);

      setShowModal(false);
      console.log('AvailableTasks: Navigating to My Active Tasks');
      navigate("/my-active-tasks");
    } catch (error) {
      console.error('Error accepting task:', error);
      alert(`Failed to accept task: ${error.message}`);
    }
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
                      className="absolute right-0 mt-2 w-100 bg-white rounded-lg shadow-xl z-50 max-h-150 overflow-y-auto"
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
                  (priorityFilter === "all" || task.priority === priorityFilter) &&
                  !acceptedTaskIds.includes(task.id) // Filter out accepted tasks
              )
              .map((task) => {
                const colors = getPriorityColor(task.priority);
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-lg border-2 ${colors.border} p-6 shadow-sm flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
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
                        className="text-gray-600 mt-1 shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        Location: {task.location}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="flex items-start gap-2 mb-2">
                      <Phone
                        size={16}
                        className="text-gray-600 mt-1 shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        Contact: {task.contact}
                      </span>
                    </div>

                    {/* Contact Person */}
                    <div className="flex items-start gap-2 mb-4">
                      <User size={16} className="text-gray-600 mt-1 shrink-0" />
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
