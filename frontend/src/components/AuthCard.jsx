import "../styles/auth.css";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
