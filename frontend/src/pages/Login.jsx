import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { login } from "../services/authService";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login({ email, password });
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Please Enter Your Details">
      
      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {/* 👇 Register Link */}
      <p className="auth-link">
        Don’t have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>

    </AuthCard>
  );
}
