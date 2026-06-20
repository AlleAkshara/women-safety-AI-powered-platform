import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SOSAlert() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [sosSent, setSosSent] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [counting, setCounting] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getLocation();
    const saved = localStorage.getItem("emergencyContacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (counting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (counting && countdown === 0) {
      setCounting(false);
      sendWhatsAppAlerts();
      setSosSent(true);
    }
  }, [counting, countdown]);

  const getLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Unable to get location. Please allow access.")
    );
  };

  const sendWhatsAppAlerts = () => {
    if (contacts.length === 0) {
      const message = location
        ? "SOS EMERGENCY! I need help immediately! My location: https://maps.google.com/?q=" + location.lat + "," + location.lng
        : "SOS EMERGENCY! I need help immediately! Please call me!";
      window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
      return;
    }

    contacts.forEach((contact, index) => {
      const message = location
        ? "SOS EMERGENCY! " + contact.name + ", I need help immediately! My live location: https://maps.google.com/?q=" + location.lat + "," + location.lng + " - Please call me or send help!"
        : "SOS EMERGENCY! " + contact.name + ", I need help immediately! Please call me!";

      setTimeout(() => {
        window.open(
          "https://wa.me/" + contact.phone.replace(/\D/g, "") + "?text=" + encodeURIComponent(message),
          "_blank"
        );
      }, index * 1500);
    });
  };

  const handleSOS = () => {
    setCounting(true);
    setCountdown(5);
    setSosSent(false);
  };

  const cancelSOS = () => {
    setCounting(false);
    setCountdown(5);
    setSosSent(false);
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <nav style={{
        backgroundColor: "#e91e63",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>SafeHer</div>
        <button onClick={() => navigate("/dashboard")} style={{
          backgroundColor: "white", color: "#e91e63", border: "none",
          padding: "8px 20px", borderRadius: "5px", cursor: "pointer",
          fontWeight: "bold", fontSize: "14px",
        }}>Back</button>
      </nav>

      <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "6px" }}>SOS Alert</h2>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px" }}>
          Press SOS to send your location to emergency contacts via WhatsApp.
        </p>

        {contacts.length === 0 && (
          <div style={{
            backgroundColor: "#fff3e0",
            border: "1px solid #ffcc80",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#e65100",
          }}>
            No emergency contacts saved!
            <span
              onClick={() => navigate("/contacts")}
              style={{ color: "#e91e63", cursor: "pointer", fontWeight: "bold", marginLeft: "6px" }}
            >
              Add contacts now
            </span>
          </div>
        )}

        {contacts.length > 0 && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
            <h3 style={{ fontSize: "14px", color: "#333", marginBottom: "10px" }}>
              Will alert {contacts.length} contact(s) via WhatsApp:
            </h3>
            {contacts.map((c) => (
              <div key={c.id} style={{
                fontSize: "13px", color: "#555",
                padding: "4px 0",
                borderBottom: "1px solid #f5f5f5",
              }}>
                {c.name} ({c.relation}) - {c.phone}
              </div>
            ))}
          </div>
        )}

        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <h3 style={{ fontSize: "14px", color: "#333", marginBottom: "8px" }}>Your Location</h3>
          {location ? (
            <p style={{ fontSize: "13px", color: "#555" }}>
              {"Lat: " + location.lat.toFixed(6) + " | Lng: " + location.lng.toFixed(6)}
            </p>
          ) : locationError ? (
            <p style={{ fontSize: "13px", color: "#c62828" }}>{locationError}</p>
          ) : (
            <p style={{ fontSize: "13px", color: "#888" }}>Getting your location...</p>
          )}
        </div>

        {!counting && !sosSent && (
          <div style={{ textAlign: "center" }}>
            <button onClick={handleSOS} style={{
              width: "180px", height: "180px",
              borderRadius: "50%",
              backgroundColor: "#d32f2f",
              color: "white",
              border: "6px solid #ffcdd2",
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "pointer",
            }}>
              SOS
            </button>
          </div>
        )}

        {counting && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "180px", height: "180px",
              borderRadius: "50%",
              backgroundColor: "#ff5722",
              color: "white",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "60px", fontWeight: "bold",
              border: "6px solid #ffccbc",
            }}>
              {countdown}
            </div>
            <p style={{ fontSize: "16px", color: "#555", marginBottom: "16px" }}>
              Sending WhatsApp SOS in {countdown} seconds...
            </p>
            <button onClick={cancelSOS} style={{
              backgroundColor: "#757575", color: "white", border: "none",
              padding: "12px 32px", borderRadius: "8px",
              cursor: "pointer", fontWeight: "bold", fontSize: "15px",
            }}>Cancel</button>
          </div>
        )}

        {sosSent && (
          <div style={{
            backgroundColor: "#e8f5e9",
            border: "2px solid #4caf50",
            borderRadius: "12px",
            padding: "28px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <h3 style={{ fontSize: "20px", color: "#2e7d32", marginBottom: "8px" }}>
              WhatsApp SOS Sent!
            </h3>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
              WhatsApp opened for each of your emergency contacts with your location.
            </p>
            <button onClick={cancelSOS} style={{
              backgroundColor: "#e91e63", color: "white", border: "none",
              padding: "10px 24px", borderRadius: "6px",
              cursor: "pointer", fontWeight: "bold", fontSize: "14px",
            }}>Send Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SOSAlert;
