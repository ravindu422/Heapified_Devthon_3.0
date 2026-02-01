import React, { useState } from "react";
import { Search, User } from "lucide-react";

const VolunteerSignUp = () => {
  const [activeTab, setActiveTab] = useState("information");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    console.log("Form data:", formData);
    // Add navigation to next step
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
            <p className="text-sm text-gray-500 px-4 mb-2">Menu</p>

            <button
              onClick={() => setActiveTab("information")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "information"
                  ? "bg-teal-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User size={20} />
              <span className="font-medium">Your Information</span>
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "contact"
                  ? "bg-teal-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
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
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <div className="flex items-center gap-2 ml-4">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <span className="text-gray-700">Unknown user</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-2 border-2 border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
};

export default VolunteerSignUp;
