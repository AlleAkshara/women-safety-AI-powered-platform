import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <nav style={{ backgroundColor: "#e91e63", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => navigate("/")} style={{ color: "white", fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}>🛡️ SafeHer</div>
      </nav>
      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>👤</div>
          <div>
            <h3 style={{ fontSize: "17px", color: "#333", marginBottom: "4px" }}>Welcome!</h3>
            <p style={{ fontSize: "13px", color: "#888" }}>You are protected. All systems active.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            { icon: "🚨", title: "SOS Alert", desc: "Send emergency alerts to your trusted contacts instantly.", route: "/sos", color: "#d32f2f" },
            { icon: "📍", title: "Nearby Services", desc: "Find police stations, hospitals and safe zones near you.", route: "/services", color: "#1565c0" },
            { icon: "🤖", title: "AI Threat Detection", desc: "Describe your situation and AI will analyze potential risks.", route: "/threat", color: "#6a1b9a" },
            { icon: "📞", title: "Emergency Contacts", desc: "Manage and quickly access your trusted emergency contacts.", route: "/contacts", color: "#2e7d32" },
          ].map((card, i) => (
            <div key={i} style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>{card.icon}</div>
              <h3 style={{ fontSize: "16px", color: "#333" }}>{card.title}</h3>
              <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6", flex: 1 }}>{card.desc}</p>
              <button onClick={() => navigate(card.route)} style={{ backgroundColor: card.color, color: "white", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", alignSelf: "flex-start" }}>Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
