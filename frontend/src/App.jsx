import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import SafeZoneFinder from './pages/SafeZoneFinder'
import Home from './pages/Home'
import AlertManage from './pages/admin/AlertManage'
import ResourcesAvailability from './pages/ResourcesAvailability'
import Updates from './pages/Updates'

// Placeholder components for new routes
const SafeZones = () => (
  <div className="min-h-screen pt-20 px-4">
    <h1 className="text-3xl font-bold">Safe Zones - Coming Soon</h1>
    <p className="mt-4 text-gray-600">This page will show safe zones and shelters.</p>
  </div>
);

const CrisisMap = () => (
  <div className="min-h-screen pt-20 px-4">
    <h1 className="text-3xl font-bold">Crisis Map - Coming Soon</h1>
    <p className="mt-4 text-gray-600">This page will show the interactive crisis map.</p>
  </div>
);

const Resources = () => (
  <div className="min-h-screen pt-20 px-4">
    <h1 className="text-3xl font-bold">Resources - Coming Soon</h1>
    <p className="mt-4 text-gray-600">This page will show resource availability.</p>
  </div>
);

const VolunteerSignup = () => (
  <div className="min-h-screen pt-20 px-4">
    <h1 className="text-3xl font-bold">Volunteer Signup - Coming Soon</h1>
    <p className="mt-4 text-gray-600">This page will have volunteer registration form.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />}/>
        <Route path='/safe-zones' element={<SafeZoneFinder />} />
        <Route path='/crisis-map' element={<CrisisMap />}/>
        <Route path='/resources' element={<ResourcesAvailability />}/>
        <Route path='/volunteer-signup' element={<VolunteerSignup />}/>
        <Route path='/updates' element={<Updates />}/>
        
        {/* Admin Routes */}
        <Route path='/alert-manage' element={<AlertManage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
