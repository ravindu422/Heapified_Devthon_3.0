import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
    <footer className="bg-teal-700 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Main Content Grid - 5 Columns in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-8 lg:gap-6 mb-8">
          
          {/* Column 1: Logo and Brand Section */}
          <div className="flex flex-col items-center sm:items-start">
            <img src="src/assets/Main_logo.png" alt="SafeLanka" className='w-56 h-56'/>
          </div>

          {/* Column 2: SafeLanka Title */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">SafeLanka</h3>
            <p className="text-sm sm:text-base font-medium leading-snug">
              National Disaster Response &<br />
              VolunteerCoordination Platform
            </p>
          </div>

          {/* Column 3: About Us Section */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-3">About Us</h3>
            <p className="text-xs sm:text-sm leading-relaxed">
              SafeLanka is a national disaster response and volunteer
              coordination platform designed to provide timely information,
              support emergency services, and connect communities during times
              of crisis across Sri Lanka.
            </p>
          </div>

          {/* Column 4: Emergency Contacts Section */}
          <div className="text-center sm:text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Emergency Contacts</h3>
            <div className="space-y-2 inline-block sm:block text-center">
              <div className="border-b border-white pb-2">
                <span className="font-medium text-sm sm:text-base">Emergency: 119</span>
              </div>
              <div className="border-b border-white pb-2">
                <span className="font-medium text-sm sm:text-base">Ambulance: 1990</span>
              </div>
              <div className="border-b border-white pb-2">
                <span className="font-medium text-sm sm:text-base">Fire & Rescue: 110</span>
              </div>
            </div>
          </div>

          {/* Column 5: Quick Links Section */}
          <div className="text-center sm:text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quickes Links</h3>
            <nav className="space-y-2 inline-block sm:block text-center">
              <a href="#" className="block border-b border-white pb-2 hover:opacity-80 transition text-sm sm:text-base">
                Home
              </a>
              <a href="#" className="block border-b border-white pb-2 hover:opacity-80 transition text-sm sm:text-base">
                Crisis Map
              </a>
              <a href="#" className="block border-b border-white pb-2 hover:opacity-80 transition text-sm sm:text-base">
                Safe Zones
              </a>
              <a href="/volunteer-dashboard" className="block border-b border-white pb-2 hover:opacity-80 transition text-sm sm:text-base">
                Volunteer Registration
              </a>
              <a href="#" className="block border-b border-white pb-2 hover:opacity-80 transition text-sm sm:text-base">
                Report Incident
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center pt-6 sm:pt-8 border-t border-teal-600">
          <p className="text-xs sm:text-sm">© 2026 SafeLanka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer