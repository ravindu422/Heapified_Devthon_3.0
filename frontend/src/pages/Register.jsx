import { useState } from "react";
import AuthCard from "../components/AuthCard";
import { register } from "../services/authService";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({});

  const handleRegister = async () => {
    await register(form);
  };

  return (
    <AuthCard title="Welcome SafeLanka" subtitle="Please Enter Your Details">
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <input type="password" placeholder="Confirm Password" />
      <button onClick={handleRegister}>Register Here</button>
    </AuthCard>
  );
}
