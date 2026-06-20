import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("emergencyContacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const saveContacts = (updated) => {
    setContacts(updated);
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
  };

  const handleAdd = () => {
    setError("");
    setSuccess("");

    if (!name.trim()) { setError("Please enter a name."); return; }
    if (!phone.trim() || phone.length < 10) { setError("Please enter a valid phone number."); return; }
    if (!relation.trim()) { setError("Please enter the relation."); return; }

    const newContact = { id: Date.now(), name, phone, relation };
    const updated = [...contacts, newContact];
    saveContacts(updated);
    setName("");
    setPhone("");
    setRelation("");
    setSuccess("Contact added successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    saveContacts(updated);
  };

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
        <div onClick={() => navigate("/")} style={{ color: "white", fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}>🛡️ SafeHer</div>
        <button onClick={() => navigate("/dashboard")} style={{
          backgroundColor: "white", color: "#e91e63", border: "none",
          padding: "8px 20px", borderRadius: "5px", cursor: "pointer",
          fontWeight: "bold", fontSize: "14px",
        }}>← Back</button>
      </nav>

      <div style={{ padding: "30px 20px", maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "6px" }}>📞 Emergency Contacts</h2>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px" }}>
          Add trusted contacts who will be alerted during an SOS emergency.
        </p>

        {/* ADD CONTACT FORM */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <h3 style={{ fontSize: "16px", color: "#333", marginBottom: "16px" }}>➕ Add New Contact</h3>

          {error && <div style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
          {success && <div style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "12px" }}>{success}</div>}

          {/* RESPONSIVE: stacks to 1 column on small screens, 3 columns on wider screens */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "6px" }}>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Mom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "6px" }}>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "6px" }}>Relation</label>
              <input
                type="text"
                placeholder="e.g. Mother"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button onClick={handleAdd} style={{
            width: "100%",
            backgroundColor: "#e91e63", color: "white", border: "none",
            padding: "12px 24px", borderRadius: "6px", cursor: "pointer",
            fontWeight: "bold", fontSize: "14px",
          }}>Add Contact</button>
        </div>

        {/* CONTACTS LIST */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <h3 style={{ fontSize: "16px", color: "#333", marginBottom: "16px" }}>
            👥 Saved Contacts ({contacts.length})
          </h3>

          {contacts.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px", color: "#888" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
              <p style={{ fontSize: "14px" }}>No contacts added yet. Add your first emergency contact above!</p>
            </div>
          )}

          {contacts.map((contact) => (
            <div key={contact.id} style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #eee",
              marginBottom: "10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "42px", height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#fce4ec",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}>👤</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: "#333" }}>{contact.name}</div>
                  <div style={{ fontSize: "13px", color: "#888" }}>{contact.relation} · {contact.phone}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={`tel:${contact.phone}`} style={{
                  backgroundColor: "#e8f5e9", color: "#2e7d32",
                  border: "none", padding: "8px 14px", borderRadius: "6px",
                  cursor: "pointer", fontWeight: "bold", fontSize: "13px",
                  textDecoration: "none",
                }}>📞 Call</a>
                <button onClick={() => handleDelete(contact.id)} style={{
                  backgroundColor: "#ffebee", color: "#c62828",
                  border: "none", padding: "8px 14px", borderRadius: "6px",
                  cursor: "pointer", fontWeight: "bold", fontSize: "13px",
                }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmergencyContacts;
