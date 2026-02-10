import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext.jsx";

const ContactAvailability = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();
  const [activeTab, setActiveTab] = useState("contact");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState({
    hour: "08",
    minute: "00",
    period: "AM",
  });
  const [formData, setFormData] = useState({
    notes: "",
    emergencyContactName: "",
    relationship: "",
    emergencyPhone: "",
  });
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026

  // Get user data from localStorage (set by volunteer signup page)
  const getUserData = () => {
    const userData = localStorage.getItem('volunteerData');
    return userData ? JSON.parse(userData) : null;
  };

  // Get user display name
  const getUserDisplayName = () => {
    // First check if user is logged in (after successful registration)
    if (user && user.fullName) {
      return user.fullName;
    }

    // Then check for temporary volunteer data (during registration process)
    const userData = getUserData();
    if (userData && userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return 'Unknown user';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (field, value) => {
    setSelectedTime((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Form submitted:", { ...formData, selectedDate, selectedTime });

    // Validation
    if (!selectedDate) {
      alert("Please select a date for your availability");
      return;
    }

    if (!formData.emergencyContactName || !formData.relationship || !formData.emergencyPhone) {
      alert("Please fill in all emergency contact information");
      return;
    }

    // Get user data from localStorage
    const userData = getUserData();
    if (!userData) {
      alert("User information not found. Please start over from the beginning.");
      navigate("/volunteer-signup");
      return;
    }

    // Create the full date object
    const fullDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);

    // First, register the user
    const userPayload = {
      fullName: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      password: userData.password,
      location: userData.location,
      photo: userData.photo,
      skills: userData.skills,
    };

    try {
      // Register user
      const userResponse = await fetch("http://localhost:5080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      const userDataResponse = await userResponse.json();
      console.log("User registration response:", userDataResponse);

      if (!userResponse.ok) {
        throw new Error(userDataResponse.message || "Failed to register user");
      }

      // Then save contact availability
      const contactPayload = {
        userId: userDataResponse.user.id,
        availability: {
          date: fullDate.toISOString(),
          time: selectedTime,
          notes: formData.notes,
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.relationship,
          phone: formData.emergencyPhone,
        },
      };

      const contactResponse = await fetch("http://localhost:5080/api/contact-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactPayload),
      });

      const contactData = await contactResponse.json();
      console.log("Contact availability response:", contactData);

      if (!contactResponse.ok) {
        throw new Error(contactData.message || "Failed to save contact information");
      }

      // Clear localStorage and set user data for display
      localStorage.removeItem('volunteerData');

      // Store user info for display in other pages
      login({
        fullName: userDataResponse.user.fullName,
        email: userDataResponse.user.email,
        id: userDataResponse.user.id,
        phoneNumber: userDataResponse.user.phoneNumber,
      });

      console.log('ContactAvailability: User logged in with data:', {
        fullName: userDataResponse.user.fullName,
        email: userDataResponse.user.email,
        id: userDataResponse.user.id
      });

      // Show success message and redirect to dashboard
      alert("🎉 Registration Complete! Thank you for volunteering with SafeLanka. Your information has been saved successfully.");
      setTimeout(() => {
        navigate("/volunteer-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  // Calendar logic
  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const renderCalendar = () => {
    const days = [];
    const blanks = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<td key={`blank-${i}`} className="p-2"></td>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isWeekend =
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          d,
        ).getDay() === 0 ||
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          d,
        ).getDay() === 6;
      days.push(
        <td key={d} className="p-2">
          <button
            onClick={() => setSelectedDate(d)}
            className={`w-8 h-8 rounded flex items-center justify-center text-sm ${selectedDate === d
              ? "bg-teal-500 text-white"
              : isWeekend
                ? "text-red-500"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {d}
          </button>
        </td>,
      );
    }

    const totalSlots = [...blanks, ...days];
    const rows = [];
    let cells = [];

    totalSlots.forEach((day, i) => {
      if (i % 7 !== 0) {
        cells.push(day);
      } else {
        rows.push(cells);
        cells = [day];
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    return rows.map((row, i) => <tr key={i}>{row}</tr>);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Volunteer</h1>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <a
              href="/volunteer-signup"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              <User size={20} />
              <span className="font-medium">Your Information</span>
            </a>

            <a
              href="/contact-availability"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-teal-500 text-white"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Contact & Availability</span>
            </a>

            <a
              href="/volunteer-dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <Navbar />

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-8 max-w-7xl">
          {/* Availability Schedule */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Availability Schedule
            </h2>

            <div className="grid grid-cols-3 gap-6">
              {/* Calendar */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Select a Date
                </label>
                <div className="border-2 border-teal-500 rounded-lg p-2 w-full min-w-[340px]">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">
                        {monthNames[currentMonth.getMonth()]}
                      </div>
                      <div className="text-2xl font-bold text-teal-600">
                        {currentMonth.getFullYear()}
                      </div>
                    </div>
                    <button
                      onClick={nextMonth}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-xs font-semibold text-red-500 p-1">
                          SU
                        </th>
                        <th className="text-xs font-semibold text-gray-700 p-1">
                          MO
                        </th>
                        <th className="text-xs font-semibold text-gray-700 p-1">
                          TU
                        </th>
                        <th className="text-xs font-semibold text-gray-700 p-1">
                          WE
                        </th>
                        <th className="text-xs font-semibold text-gray-700 p-1">
                          TH
                        </th>
                        <th className="text-xs font-semibold text-gray-700 p-1">
                          FR
                        </th>
                        <th className="text-xs font-semibold text-red-500 p-1">
                          SA
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderCalendar()}</tbody>
                  </table>
                </div>
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Select a Time
                </label>
                <div className="border border-gray-300 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-4">Enter time</p>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="number"
                      min="01"
                      max="12"
                      value={selectedTime.hour}
                      onChange={(e) =>
                        handleTimeChange(
                          "hour",
                          e.target.value.padStart(2, "0"),
                        )
                      }
                      className="w-16 text-3xl font-bold text-center border-b-2 border-gray-300 focus:outline-none focus:border-teal-500"
                    />
                    <span className="text-3xl font-bold">:</span>
                    <input
                      type="number"
                      min="00"
                      max="59"
                      value={selectedTime.minute}
                      onChange={(e) =>
                        handleTimeChange(
                          "minute",
                          e.target.value.padStart(2, "0"),
                        )
                      }
                      className="w-16 text-3xl font-bold text-center border-b-2 border-gray-300 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTimeChange("period", "AM")}
                      className={`flex-1 py-2 rounded ${selectedTime.period === "AM"
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => handleTimeChange("period", "PM")}
                      className={`flex-1 py-2 rounded ${selectedTime.period === "PM"
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      PM
                    </button>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 flex justify-between">
                    <span>Hour</span>
                    <span>Minute</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional availability info..."
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Emergency Contact
            </h2>

            <div className="max-w-sm">
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="First"
                  className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  Relationship
                </label>
                <div className="flex items-center gap-6">
                  <input
                    type="text"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    placeholder="Parent / Husband / Wife"
                    className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-red-500 text-sm whitespace-nowrap">
                    This will only be used in emergencies
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  placeholder="XXX XXXXXXX"
                  className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <a
              href="/volunteer-signup"
              className="px-8 py-2 border-2 border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Preview
            </a>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactAvailability;
