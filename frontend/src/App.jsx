import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import AlertManage from "./pages/admin/AlertManage";
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard";
import VolunteerSignUp from "./pages/VolunteerSignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer-signup" element={<VolunteerSignUp />} />
        <Route path="/alert-manage" element={<AlertManage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
