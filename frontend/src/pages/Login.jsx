import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Please Enter Your Details"
    >
      <div className="input-group">
        <span>📧</span>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <span>🔒</span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>Login</button>

      <p className="auth-link">Forgot Password?</p>

      <p className="auth-link">
        Don’t Have an Account?{" "}
        <Link to="/register">Register Here</Link>
      </p>
    </AuthCard>
  );
}
