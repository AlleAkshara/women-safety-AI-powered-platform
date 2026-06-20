const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export async function analyzeThreatWithAI(situation) {
  if (!API_KEY || API_KEY === "your_claude_api_key_here") {
    throw new Error("No API key configured. Add VITE_CLAUDE_API_KEY to your .env file.");
  }

  const systemPrompt = `You are a women's safety AI assistant for the SafeHer app.
Analyze the user's described situation and respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{
  "threat_level": "High" | "Medium" | "Low",
  "summary": "One sentence summary of the risk",
  "immediate_actions": ["action1", "action2", "action3", "action4", "action5"],
  "emergency_tip": "A practical safety tip"
}
High: immediate physical danger. Medium: uncomfortable/suspicious situation. Low: safe but stay alert.
Actions must be practical and India-focused (use 112, 100, 1091 helpline).`;

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 600, system: systemPrompt, messages: [{ role: "user", content: situation }] }),
  });

  if (!response.ok) { const e = await response.json(); throw new Error(e.error?.message || "API request failed."); }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  const colorMap = { High: { bg: "#ffebee", color: "#c62828", border: "#ef9a9a" }, Medium: { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" }, Low: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" } };
  const iconMap = { High: "🔴", Medium: "🟡", Low: "🟢" };
  return { ...parsed, color: colorMap[parsed.threat_level] || colorMap.Low, icon: iconMap[parsed.threat_level] || "🟢" };
}