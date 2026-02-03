import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { register } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
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
        fullName: "SafeLanka User",
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <AuthCard
      title="Welcome SafeLanka"
      subtitle="Please Enter Your Details"
    >
      <div className="input-group">
        <span>📧</span>
        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="input-group">
        <span>🔒</span>
        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div className="input-group">
        <span>🔒</span>
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={e =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
      </div>

      <button onClick={handleRegister}>Register Here</button>

      <p className="auth-link">
        Already Have an Account?{" "}
        <Link to="/login">Login Here</Link>
      </p>
    </AuthCard>
  );
}
