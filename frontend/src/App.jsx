import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from './contexts/UserContext.jsx';

import Home from "./pages/Home";
import AlertManage from "./pages/admin/AlertManage";
import PublishAlert from './pages/admin/PublishAlert'
import ViewCrisisMap from './pages/ViewCrisisMap'
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard";
import VolunteerSignUp from "./pages/VolunteerSignUp";
import ContactAvailability from "./pages/ContactAvailability";
import QuickStats from "./pages/QuickStats";
import AvailableTasks from "./pages/AvailableTasks";
import MyActiveTasks from "./pages/MyActiveTasks";
//import TaskManage from './pages/admin/TaskManage';


function App() {
  return (
    <UserProvider>
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
          <Route path='/crisis-map' element={<ViewCrisisMap />} />

          {/* Admin Routes (RBAC Protected) */}
          <Route
            path="/manage-alert"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AlertManage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/publish-alert'
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <PublishAlert />
              </ProtectedRoute>
            }
          />

          {/* <Route 
             path='/task-manage' 
             element={
               <ProtectedRoute roles={["ADMIN"]}>
                  <TaskManage/>
               </ProtectedRoute>
             }
          /> */}

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;