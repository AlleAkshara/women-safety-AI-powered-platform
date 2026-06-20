import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "#e91e63",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          🛡️ SafeHer
        </div>
        <button onClick={() => navigate("/dashboard")} style={{
          backgroundColor: "white",
          color: "#e91e63",
          border: "none",
          padding: "8px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}>Open Dashboard</button>
      </nav>

      {/* HERO */}
      <div style={{
        backgroundColor: "#e91e63",
        color: "white",
        padding: "80px 30px",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>Your Safety, Our Priority</h1>
        <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "32px", maxWidth: "560px", margin: "0 auto 32px" }}>
          AI-powered women's safety platform with SOS alerts, nearby services, and real-time threat detection.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/dashboard")} style={{
            backgroundColor: "white",
            color: "#e91e63",
            border: "none",
            padding: "14px 32px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}>Get Started</button>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "60px 30px", backgroundColor: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "40px", color: "#333" }}>
          Everything You Need to Stay Safe
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          maxWidth: "960px",
          margin: "0 auto",
        }}>
          {[
            { icon: "🚨", title: "SOS Alert", desc: "Send emergency alerts to your trusted contacts instantly with one tap.", route: "/sos" },
            { icon: "📍", title: "Nearby Services", desc: "Find police stations, hospitals and safe zones near your location.", route: "/services" },
            { icon: "🤖", title: "AI Threat Detection", desc: "Analyze risky situations using AI to identify potential dangers.", route: "/threat" },
            { icon: "📞", title: "Emergency Contacts", desc: "Quick access to your trusted emergency contacts anytime.", route: "/contacts" },
          ].map((f, i) => (
            <div
              key={i}
              onClick={() => navigate(f.route)}
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                padding: "28px 20px",
                textAlign: "center",
                border: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <div style={{
                fontSize: "36px",
                marginBottom: "12px",
              }}>{f.icon}</div>
              <h3 style={{ fontSize: "17px", marginBottom: "10px", color: "#333" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        backgroundColor: "#e91e63",
        color: "white",
        textAlign: "center",
        padding: "20px",
        fontSize: "14px",
        opacity: 0.9,
      }}>
        © 2026 SafeHer — AI-Powered Women's Safety Platform
      </div>

    </div>
  );
}

export default Landing;
