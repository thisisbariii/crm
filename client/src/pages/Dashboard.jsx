import { useEffect, useState } from "react";
import api from "../api.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Total Contacts", value: stats.totalContacts },
    { label: "Total Conversations", value: stats.totalConversations },
    { label: "Total Messages", value: stats.totalMessages },
    { label: "Total AI Responses", value: stats.totalAIResponses },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
