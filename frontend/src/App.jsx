import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AlertManage from "./pages/admin/AlertManage";
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard";
import VolunteerSignUp from "./pages/VolunteerSignUp";
import ContactAvailability from "./pages/ContactAvailability";
import QuickStats from "./pages/QuickStats";
import AvailableTasks from "./pages/AvailableTasks";
import MyActiveTasks from "./pages/MyActiveTasks";
import TaskManage from './pages/admin/TaskManage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
          
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer-signup" element={<VolunteerSignUp />} />
        <Route path="/contact-availability" element={<ContactAvailability />} />
        <Route path="/quick-stats" element={<QuickStats />} />
        <Route path="/available-tasks" element={<AvailableTasks />} />
        <Route path="/my-active-tasks" element={<MyActiveTasks />} />
        <Route path="/alert-manage" element={<AlertManage />} />

        {/* Admin Routes (RBAC Protected) */}
        <Route
          path="/alert-manage"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AlertManage />
            </ProtectedRoute>
          }
        />

        <Route 
           path='/task-manage' 
           element={
             <ProtectedRoute roles={["ADMIN"]}>
              <TaskManage/>
            </ProtectedRoute>
           }
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;