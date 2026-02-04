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

      // Always go to login after register
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthCard title="Welcome SafeLanka" subtitle="Create your account">
      <div className="input-group">
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
        />
      </div>

      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={e =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
      </div>

      <button onClick={handleRegister}>Register</button>

      <p className="auth-link">
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </AuthCard>
  );
}
