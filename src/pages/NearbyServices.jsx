import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function NearbyServices() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMap, setActiveMap] = useState("police");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError("Unable to get your location. Please allow location access.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const openGoogleMaps = (type) => {
    if (!location) return;
    const queries = {
      police: "police+station",
      hospital: "hospital",
      clinic: "clinic",
    };
    const url = `https://www.google.com/maps/search/${queries[type]}/@${location.lat},${location.lon},14z`;
    window.open(url, "_blank");
  };

  const emergencyCards = [
    { icon: "🚔", label: "Police Emergency", number: "100", color: "#1565c0", bg: "#e3f2fd" },
    { icon: "🚑", label: "Ambulance", number: "108", color: "#c62828", bg: "#ffebee" },
    { icon: "🆘", label: "All Emergencies", number: "112", color: "#6a1b9a", bg: "#f3e5f5" },
    { icon: "👩", label: "Women Helpline", number: "1091", color: "#e91e63", bg: "#fce4ec" },
  ];

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: "#e91e63", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => navigate("/")} style={{ color: "white", fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}>🛡️ SafeHer</div>
        <button onClick={() => navigate("/dashboard")} style={{ backgroundColor: "white", color: "#e91e63", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>← Back</button>
      </nav>

      <div style={{ padding: "24px 16px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "6px" }}>📍 Nearby Services</h2>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}>Find police stations, hospitals and clinics near your location.</p>

        {/* Emergency numbers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {emergencyCards.map((c, i) => (
            <a key={i} href={"tel:" + c.number} style={{ textDecoration: "none" }}>
              <div style={{ backgroundColor: c.bg, borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${c.bg}`, cursor: "pointer" }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{c.icon}</div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: c.color }}>{c.number}</div>
                <div style={{ fontSize: "11px", color: c.color, marginTop: "2px" }}>{c.label}</div>
              </div>
            </a>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 16px", color: "#888" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📡</div>
            <p>Getting your location...</p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>Please allow location access when prompted</p>
          </div>
        )}

        {!loading && location && (
          <>
            {/* Quick open buttons — full width on mobile, auto on desktop */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
              <button
                onClick={() => openGoogleMaps("police")}
                style={{ backgroundColor: "#1565c0", color: "white", border: "none", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textAlign: "center" }}
              >
                🚔 Police Stations
              </button>
              <button
                onClick={() => openGoogleMaps("hospital")}
                style={{ backgroundColor: "#c62828", color: "white", border: "none", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textAlign: "center" }}
              >
                🏥 Hospitals
              </button>
              <button
                onClick={() => openGoogleMaps("clinic")}
                style={{ backgroundColor: "#2e7d32", color: "white", border: "none", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
              >
                💊 Clinics
              </button>
            </div>

            {/* Map toggle — wraps on small screens */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveMap("police")}
                style={{ padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "13px", backgroundColor: activeMap === "police" ? "#1565c0" : "white", color: activeMap === "police" ? "white" : "#555", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
              >
                🚔 Police Map
              </button>
              <button
                onClick={() => setActiveMap("hospital")}
                style={{ padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "13px", backgroundColor: activeMap === "hospital" ? "#c62828" : "white", color: activeMap === "hospital" ? "white" : "#555", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
              >
                🏥 Hospital Map
              </button>
              <button
                onClick={() => setActiveMap("osm")}
                style={{ padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "13px", backgroundColor: activeMap === "osm" ? "#e91e63" : "white", color: activeMap === "osm" ? "white" : "#555", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
              >
                📍 Your Location
              </button>
            </div>

            {/* Google Maps Embed for police */}
            {activeMap === "police" && (
              <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
                <div style={{ backgroundColor: "#1565c0", color: "white", padding: "10px 16px", fontSize: "14px", fontWeight: "bold" }}>
                  🚔 Police Stations near you
                </div>
                <iframe
                  title="Police Stations Map"
                  width="100%"
                  height="380"
                  style={{ border: 0, display: "block", maxWidth: "100%" }}
                  src={`https://maps.google.com/maps?q=police+station&ll=${location.lat},${location.lon}&z=13&output=embed`}
                  allowFullScreen
                />
              </div>
            )}

            {/* Google Maps Embed for hospitals */}
            {activeMap === "hospital" && (
              <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
                <div style={{ backgroundColor: "#c62828", color: "white", padding: "10px 16px", fontSize: "14px", fontWeight: "bold" }}>
                  🏥 Hospitals & Clinics near you
                </div>
                <iframe
                  title="Hospitals Map"
                  width="100%"
                  height="380"
                  style={{ border: 0, display: "block", maxWidth: "100%" }}
                  src={`https://maps.google.com/maps?q=hospital&ll=${location.lat},${location.lon}&z=13&output=embed`}
                  allowFullScreen
                />
              </div>
            )}

            {/* OpenStreetMap — your location */}
            {activeMap === "osm" && (
              <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
                <div style={{ backgroundColor: "#e91e63", color: "white", padding: "10px 16px", fontSize: "14px", fontWeight: "bold" }}>
                  📍 Your Current Location
                </div>
                <MapContainer center={[location.lat, location.lon]} zoom={15} style={{ height: "380px", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                  <Circle center={[location.lat, location.lon]} radius={100} color="#e91e63" fillColor="#e91e63" fillOpacity={0.8} />
                  <Marker position={[location.lat, location.lon]}>
                    <Popup><strong>📍 You are here</strong><br />{location.lat.toFixed(5)}, {location.lon.toFixed(5)}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            {/* Location info — stacks on mobile */}
            <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "14px 18px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "22px" }}>📌</span>
              <div style={{ flex: "1 1 180px" }}>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>Your Location</div>
                <div style={{ fontSize: "12px", color: "#888" }}>Lat: {location.lat.toFixed(5)} | Lon: {location.lon.toFixed(5)}</div>
              </div>
              <a
                href={`https://maps.google.com/?q=${location.lat},${location.lon}`}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: "#e91e63", color: "white", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" }}
              >
                Open in Google Maps
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NearbyServices;
