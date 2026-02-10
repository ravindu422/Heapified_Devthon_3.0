import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      // res === res.data

      // ✅ FIX HERE
      setAuth(res.token, res.user);

      // ✅ FIX HERE
      if (res.user.role === "ADMIN") {
        navigate("/manage-alert");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Please enter your details">
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>Login</button>

      <p className="auth-link">
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </AuthCard>
  );
}
