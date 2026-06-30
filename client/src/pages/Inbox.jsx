import { useEffect, useState } from "react";
import api from "../api.js";

export default function Inbox() {
  const [contacts, setContacts] = useState([]);
  const [activePhone, setActivePhone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [customPrompt, setCustomPrompt] = useState(
    "You are a helpful customer support assistant. Keep replies short and friendly."
  );

  useEffect(() => {
    api.get("/contacts").then((res) => setContacts(res.data));
  }, []);

  const openChat = async (phone) => {
    setActivePhone(phone);
    const res = await api.get(`/messages/${phone}`);
    setMessages(res.data);
  };

  const sendMessage = async (body) => {
    if (!body || !activePhone) return;
    await api.post("/send", { to: activePhone, body });
    setDraft("");
    openChat(activePhone);
  };

  const generateAIReply = async () => {
    const lastIncoming = [...messages].reverse().find((m) => m.direction === "incoming");
    if (!lastIncoming) return alert("No customer message to reply to yet.");
    const res = await api.post("/generate-reply", {
      customerMessage: lastIncoming.body,
      customPrompt,
    });
    setDraft(res.data.reply);
  };

  return (
    <div className="inbox">
      <div className="conversation-list">
        <h2>Conversations</h2>
        {contacts.map((c) => (
          <div
            key={c.id}
            className={`conversation-item ${activePhone === c.phone ? "active" : ""}`}
            onClick={() => openChat(c.phone)}
          >
            <strong>{c.name}</strong>
            <p>{c.phone}</p>
          </div>
        ))}
      </div>

      <div className="chat-panel">
        {!activePhone && <p>Select a conversation</p>}
        {activePhone && (
          <>
            <h3>Chat with {activePhone}</h3>

            <div className="ai-prompt-box">
              <label>AI System Prompt</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
              />
            </div>

            <div className="messages">
              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.direction}`}>
                  <p>{m.body}</p>
                </div>
              ))}
            </div>

            <div className="compose-row">
              <textarea
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
              />
              <div className="compose-buttons">
                <button onClick={generateAIReply}>Generate AI Reply</button>
                <button onClick={() => sendMessage(draft)}>Send</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
