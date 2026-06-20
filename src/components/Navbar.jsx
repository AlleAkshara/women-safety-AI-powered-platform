import { useNavigate } from "react-router-dom";

function Navbar({ showBack, showLogout, onLogout, showLogin, showSignup }) {
  const navigate = useNavigate();
  const btn = { backgroundColor: "white", color: "#e91e63", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" };
  const outline = { ...btn, backgroundColor: "transparent", color: "white", border: "2px solid white" };

  return (
    <nav style={{ backgroundColor: "#e91e63", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div onClick={() => navigate("/")} style={{ color: "white", fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}>🛡️ SafeHer</div>
      <div style={{ display: "flex", gap: "10px" }}>
        {showBack && <button onClick={() => navigate("/dashboard")} style={btn}>← Back</button>}
        {showLogout && <button onClick={() => { onLogout?.(); navigate("/"); }} style={btn}>Logout</button>}
        {showLogin && <button onClick={() => navigate("/login")} style={outline}>Login</button>}
        {showSignup && <button onClick={() => navigate("/register")} style={btn}>Sign Up</button>}
      </div>
    </nav>
  );
}

export default Navbar;