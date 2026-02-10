import React, { useState } from 'react';
import { Search, User, Bell, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserDisplayName = () => {
    console.log('Navbar: getUserDisplayName called', { user, isAuthenticated });
    if (isAuthenticated && user?.fullName) {
      return user.fullName;
    }
    return 'Unknown user';
  };

  const getUserEmail = () => {
    if (isAuthenticated && user?.email) {
      return user.email;
    }
    return 'user@email.com';
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
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

      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            4
          </span>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <span className="text-gray-700 font-medium">{getUserDisplayName()}</span>
          </button>

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-20">
              <div className="flex flex-col items-center px-4 py-2">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                  <User size={30} className="text-teal-600" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">
                    {isAuthenticated ? `Hi, ${getUserDisplayName()}!` : 'Hi, Unknown user!'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getUserEmail()}
                  </div>
                </div>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Navigate to profile page (you can create this route)
                    console.log('Navigate to profile');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
