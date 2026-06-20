import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SOSAlert from "./pages/SOSAlert";
import EmergencyContacts from "./pages/EmergencyContacts";
import NearbyServices from "./pages/NearbyServices";
import ThreatDetection from "./pages/ThreatDetection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sos" element={<SOSAlert />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/services" element={<NearbyServices />} />
        <Route path="/threat" element={<ThreatDetection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
