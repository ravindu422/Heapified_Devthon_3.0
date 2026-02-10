import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext.jsx";

const VolunteerSignUp = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();
  const [activeTab, setActiveTab] = useState("information");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    photo: null,
    skills: {
      medical: false,
      translation: false,
      construction: false,
      foodDistribution: false,
      logistics: false,
      transport: false,
    },
  });

  // Get logged-in user data
  const getLoggedInUser = () => {
    return user;
  };

  // Clear logged-in user data (for new registration)
  const clearLoggedInUser = () => {
    // UserContext logout will handle clearing
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user && user.fullName) {
      return user.fullName;
    }

    // Fallback to current form data
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
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

  const handleSkillChange = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: !prev.skills[skill],
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  const handleNext = () => {
    // Clear any existing logged-in user data when starting new registration
    clearLoggedInUser();

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      alert(
        "Please fill in all required fields: First Name, Last Name, Email, and Password",
      );
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Save form data to localStorage for later use
    localStorage.setItem('volunteerData', JSON.stringify(formData));

    // Navigate to the next page
    navigate("/contact-availability");
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-teal-500 text-white"
            >
              <User size={20} />
              <span className="font-medium">Your Information</span>
            </a>

            <a
              href="/contact-availability"
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
          {/* Upload Photo Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Upload your details
            </h2>

            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-white" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Adjust your photo</p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Take a photo
                  </label>
                  <input
                    type="text"
                    placeholder="Take a photo"
                    className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Browse files
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Full Name
            </label>
            <div className="grid grid-cols-2 gap-1">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First"
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last"
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 6 characters"
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="XXX XXXXXXX"
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Current Location */}
          <div className="mb-8">
            <label className="block text-sm text-gray-700 mb-2">
              Current Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Select Your Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Select Your Skills
            </h3>

            <div className="space-y-3">
              {[
                { key: "medical", label: "Medical" },
                { key: "translation", label: "Translation" },
                { key: "construction", label: "Construction" },
                { key: "foodDistribution", label: "Food Distribution" },
                { key: "logistics", label: "Logistics" },
                { key: "transport", label: "Transport" },
              ].map((skill) => (
                <label
                  key={skill.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.skills[skill.key]}
                    onChange={() => handleSkillChange(skill.key)}
                    className="w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-xs">
                    {skill.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerSignUp;
