import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError("");
    if (!emailPattern.test(email)) { setError("Enter a valid email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) { onLogin(); navigate("/dashboard"); }
      else { setError(data.message || "Invalid credentials."); }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    }
    setLoading(false);
  };

  const inp = { width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", fontFamily: "Arial" }}>
      <nav style={{ backgroundColor: "#e91e63", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => navigate("/")} style={{ color: "white", fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}>🛡️ SafeHer</div>
        <button onClick={() => navigate("/register")} style={{ backgroundColor: "white", color: "#e91e63", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Sign Up</button>
      </nav>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 60px)", padding: "30px 16px" }}>
        <div style={{ backgroundColor: "white", padding: "36px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "6px", color: "#333" }}>Welcome Back</h2>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px" }}>Login to your SafeHer account</p>
          {error && <div style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "6px" }}>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "6px" }}>Password</label>
            <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} style={inp} />
          </div>
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "12px", backgroundColor: loading ? "#ccc" : "#e91e63", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#888" }}>
            Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "#e91e63", cursor: "pointer", fontWeight: "bold" }}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
