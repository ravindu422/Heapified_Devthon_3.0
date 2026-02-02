import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({});

  const handleRegister = () => {
    console.log(form);
  };

  return (
    <AuthCard title="Welcome SafeLanka" subtitle="Please Enter Your Details">

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
      />

      <button onClick={handleRegister}>Register Here</button>

      {/* 👇 Login Link */}
      <p className="auth-link">
        Already have an account?{" "}
        <Link to="/login">Sign in here</Link>
      </p>

    </AuthCard>
  );
}
