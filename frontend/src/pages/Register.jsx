import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { register } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate("/Home");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthCard title="Welcome SafeLanka" subtitle="Please Enter Your Details">

      <input
        placeholder="Full Name"
        onChange={e => setForm({ ...form, fullName: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
      />

      <button onClick={handleRegister}>Register Here</button>

      <p className="auth-link">
        Already have an account? <Link to="/login">Sign in here</Link>
      </p>

    </AuthCard>
  );
}
