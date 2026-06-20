import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ThreatDetection() {
  const navigate = useNavigate();
  const [situation, setSituation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = () => {
    if (!situation.trim()) { setError("Please describe your situation."); return; }
    setError(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(analyzeSituation(situation.toLowerCase())); setLoading(false); }, 1200);
  };

  // ── Situation-specific keyword categories with tailored actions ──
  const categories = [
    {
      keywords: ["knife", "gun", "weapon", "armed", "blade", "stab"],
      level: "High",
      icon: "🔴",
      summary: "A weapon is involved. This is a life-threatening emergency.",
      actions: [
        "Call 112 immediately — tell them a weapon is involved",
        "Do not argue or resist — comply to protect yourself",
        "Try to put distance between yourself and the threat if safe",
        "Alert anyone nearby by shouting 'Call the police!'",
        "Send SOS to your emergency contacts the moment it's safe to do so",
      ],
      tip: "Your safety matters more than belongings. Do not try to fight for property.",
      bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
    },
    {
      keywords: ["following me", "stalking", "stalker", "chasing", "chased"],
      level: "High",
      icon: "🔴",
      summary: "Someone is following or stalking you. Act now to lose them.",
      actions: [
        "Walk into the nearest open shop, restaurant, or public building",
        "Call 112 or 100 and describe the person following you",
        "Do not go home directly — head to a police station or crowded place",
        "Send your live location to a trusted contact immediately",
        "If in a vehicle, drive to the nearest police station, not your home",
      ],
      tip: "Never lead a stalker to your home. Always go somewhere public first.",
      bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
    },
    {
      keywords: ["attacked", "assault", "hitting", "grabbed", "hit me", "punched", "pushed"],
      level: "High",
      icon: "🔴",
      summary: "You are describing a physical assault. Immediate action is required.",
      actions: [
        "Call 112 immediately and report the assault",
        "Get to a safe, public location and stay there",
        "If injured, also call 108 for an ambulance",
        "Try to remember identifying details of the attacker for police",
        "Send SOS to your emergency contacts now",
      ],
      tip: "Once safe, seek medical attention even for minor injuries — get it documented.",
      bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
    },
    {
      keywords: ["kidnap", "trapped", "locked", "can't leave", "being held", "abduct"],
      level: "High",
      icon: "🔴",
      summary: "You may be confined against your will. This is critical.",
      actions: [
        "If you can, call 112 quietly without alerting anyone",
        "If you can't talk, send a text to a trusted contact with your situation",
        "Note any details about location — sounds, landmarks, vehicle details",
        "Try to stay calm and look for any opportunity to signal for help",
        "If possible, share live location via WhatsApp or Google Maps",
      ],
      tip: "If you can't speak, calling 112 and staying silent can still get help dispatched to your location.",
      bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
    },
    {
      keywords: ["rape", "molest", "touched me", "inappropriate touch", "harassed sexually"],
      level: "High",
      icon: "🔴",
      summary: "This is a serious crime. Immediate help and reporting are critical.",
      actions: [
        "Call 112 or the Women's Helpline 1091 immediately",
        "Move to a safe location away from the person",
        "Avoid changing clothes or showering if you plan to report — preserves evidence",
        "Reach out to a trusted person to be with you",
        "Visit the nearest hospital or police station to file a report",
      ],
      tip: "What happened is not your fault. Support and legal help are available 24/7 through 1091.",
      bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
    },
    {
      keywords: ["scared", "help me", "emergency", "danger", "threatening", "threatened"],
      level: "High",
      icon: "🔴",
      summary: "You're in a frightening situation. Prioritize getting to safety now.",
      actions: [
        "Call 112 right away and explain your situation",
        "Move toward the nearest public, well-lit place",
        "Send SOS to your emergency contacts immediately",
        "Stay on the phone with someone you trust while moving to safety",
        "Avoid isolated routes — choose busy streets even if longer",
      ],
      tip: "Trust your gut. If something feels wrong, treat it as an emergency.",
      bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
    },
    {
      keywords: ["alone at night", "dark street", "unsafe area", "no one around", "isolated"],
      level: "Medium",
      icon: "🟡",
      summary: "You're alone in a potentially risky environment. Stay alert and head to safety.",
      actions: [
        "Switch to a well-lit, busier route even if it takes longer",
        "Call someone and stay on the phone while you walk",
        "Keep your phone visible with location sharing turned on",
        "Walk confidently and avoid showing you're scared or lost",
        "Identify the nearest shop, hospital or police station as a safe point",
      ],
      tip: "Predators look for people who seem distracted or unsure — walk with purpose.",
      bg: "#fff3e0", color: "#e65100", border: "#ffcc80",
    },
    {
      keywords: ["suspicious", "staring", "unknown person", "strange man", "creepy person", "weird guy"],
      level: "Medium",
      icon: "🟡",
      summary: "Someone's behavior is making you uncomfortable. Trust that instinct.",
      actions: [
        "Move to a location with more people around",
        "Make it obvious you've noticed them — eye contact can deter",
        "Inform a nearby shopkeeper, guard, or stranger if you feel threatened",
        "Have your phone ready to call 100 if the behavior escalates",
        "Avoid confronting them directly — prioritize distance",
      ],
      tip: "It's okay to act on a bad feeling even without a clear reason.",
      bg: "#fff3e0", color: "#e65100", border: "#ffcc80",
    },
    {
      keywords: ["lost", "don't know where i am", "unfamiliar area", "new city", "wrong turn"],
      level: "Medium",
      icon: "🟡",
      summary: "You're in an unfamiliar place. Reorient yourself safely.",
      actions: [
        "Step into a shop, café, or hotel to check your location safely",
        "Use Google Maps to find your way to a known landmark",
        "Call a trusted contact and share your live location",
        "Ask a shop owner or family group for directions, avoid lone strangers",
        "Book a verified cab instead of walking if it's late or unfamiliar",
      ],
      tip: "Public places like hotels and stores are safe spots to pause and reorient.",
      bg: "#fff3e0", color: "#e65100", border: "#ffcc80",
    },
    {
      keywords: ["uncomfortable", "nervous", "worried", "bad feeling", "anxious"],
      level: "Medium",
      icon: "🟡",
      summary: "Something feels off. It's worth taking precautions.",
      actions: [
        "Move toward a populated, familiar area",
        "Text a friend or family member about how you're feeling",
        "Keep your phone charged and easily accessible",
        "Trust your instincts — leave the situation if you can",
        "Have emergency numbers (112, 100, 1091) ready to dial",
      ],
      tip: "You don't need a 'big reason' to leave a situation that feels wrong.",
      bg: "#fff3e0", color: "#e65100", border: "#ffcc80",
    },
  ];

  const lowDefault = {
    level: "Low",
    icon: "🟢",
    summary: "Your situation appears safe right now. Stay aware regardless.",
    actions: [
      "Stay aware of your surroundings as you move",
      "Keep your phone charged and accessible at all times",
      "Share your live location with a trusted contact as a habit",
      "Trust your instincts immediately if something starts to feel wrong",
      "Save emergency numbers: 112 (All), 100 (Police), 1091 (Women Helpline)",
    ],
    tip: "Prevention is the best safety measure — small precautions go a long way.",
    bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7",
  };

  function analyzeSituation(text) {
    // Find all matching categories
    const matches = categories.filter((cat) => cat.keywords.some((k) => text.includes(k)));

    if (matches.length === 0) {
      // No specific keywords - check length/tone as fallback for Medium
      if (text.length > 60) {
        return {
          level: "Medium",
          icon: "🟡",
          summary: "Your situation has some risk factors. Stay cautious.",
          actions: [
            "Move toward a public, well-lit area",
            "Inform a trusted person about your situation and location",
            "Keep your phone accessible and charged",
            "Trust your instincts and leave if something feels wrong",
            "Know your nearest safe point — shop, hospital, or police station",
          ],
          tip: "When in doubt, prioritize moving to a safer, busier location.",
          bg: "#fff3e0", color: "#e65100", border: "#ffcc80",
        };
      }
      return lowDefault;
    }

    // If multiple High matches, merge their actions (deduplicated) for a fuller response
    const highMatches = matches.filter((m) => m.level === "High");
    if (highMatches.length > 0) {
      if (highMatches.length === 1) return highMatches[0];

      const mergedActions = [...new Set(highMatches.flatMap((m) => m.actions))].slice(0, 6);
      return {
        level: "High",
        icon: "🔴",
        summary: "Multiple danger signs detected in your situation. Act immediately.",
        actions: mergedActions,
        tip: highMatches[0].tip,
        bg: "#ffebee", color: "#c62828", border: "#ef9a9a",
      };
    }

    // Otherwise return best Medium match (first one found)
    const mediumMatches = matches.filter((m) => m.level === "Medium");
    if (mediumMatches.length === 1) return mediumMatches[0];

    const mergedActions = [...new Set(mediumMatches.flatMap((m) => m.actions))].slice(0, 6);
    return {
      level: "Medium",
      icon: "🟡",
      summary: "Your situation has a few risk factors worth acting on.",
      actions: mergedActions,
      tip: mediumMatches[0].tip,
      bg: "#fff3e0", color: "#e65100", border: "#ffcc80",
    };
  }

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <nav style={{ backgroundColor: "#e91e63", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => navigate("/")} style={{ color: "white", fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}>🛡️ SafeHer</div>
        <button onClick={() => navigate("/dashboard")} style={{ backgroundColor: "white", color: "#e91e63", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>← Back</button>
      </nav>
      <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "6px" }}>AI Threat Detection</h2>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px" }}>Describe your situation and get tailored safety guidance based on what's happening.</p>

        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#333", display: "block", marginBottom: "10px" }}>Describe your situation:</label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. I am walking alone at night and a suspicious person is following me..."
            rows={5}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", resize: "vertical", boxSizing: "border-box", fontFamily: "Arial" }}
          />
          {error && <div style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginTop: "10px" }}>{error}</div>}
          <button
            onClick={analyze}
            disabled={loading}
            style={{ marginTop: "14px", backgroundColor: loading ? "#ccc" : "#6a1b9a", color: "white", border: "none", padding: "12px 28px", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "15px" }}
          >
            {loading ? "Analyzing..." : "Analyze Threat"}
          </button>
        </div>

        {result && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ backgroundColor: result.bg, border: "2px solid " + result.border, borderRadius: "10px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ fontSize: "36px" }}>{result.icon}</div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: result.color }}>{result.level} Threat</div>
                <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>{result.summary}</div>
              </div>
            </div>

            <h3 style={{ fontSize: "15px", color: "#333", marginBottom: "12px" }}>Recommended Actions:</h3>
            {result.actions.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#e91e63", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: "14px", color: "#444", margin: 0 }}>{a}</p>
              </div>
            ))}

            <div style={{ backgroundColor: "#e3f2fd", borderRadius: "8px", padding: "14px 16px", marginTop: "16px" }}>
              <p style={{ fontSize: "13px", color: "#1565c0", margin: 0 }}><strong>Safety Tip:</strong> {result.tip}</p>
            </div>

            {result.level !== "Low" && (
              <button
                onClick={() => navigate("/sos")}
                style={{ marginTop: "16px", width: "100%", backgroundColor: "#d32f2f", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
              >
                Send SOS Alert Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreatDetection;
