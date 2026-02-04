import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import AlertManage from "./pages/admin/AlertManage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes (RBAC Protected) */}
        <Route
          path="/alert-manage"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AlertManage />
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
