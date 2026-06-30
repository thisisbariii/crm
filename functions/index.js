const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ===== CONFIG (set these via: firebase functions:config:set whatsapp.token="..." etc,
// or simpler: paste directly here for now and redeploy when they change) =====
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || "PASTE_WHATSAPP_ACCESS_TOKEN";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "PASTE_PHONE_NUMBER_ID";
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "mysecrettoken123";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "PASTE_GEMINI_KEY";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ---------- WEBHOOK ----------
// Meta verifies this URL with a GET request
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Meta posts incoming messages here
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    const contactName = change?.contacts?.[0]?.profile?.name;

    if (message) {
      const from = message.from;
      const text = message.text?.body || "[non-text message]";

      await db.collection("messages").add({
        from,
        to: WHATSAPP_PHONE_NUMBER_ID,
        body: text,
        direction: "incoming",
        timestamp: Date.now(),
      });

      const contactRef = db.collection("contacts").doc(from);
      const contactDoc = await contactRef.get();
      if (!contactDoc.exists) {
        await contactRef.set({
          phone: from,
          name: contactName || from,
          tags: [],
          createdAt: Date.now(),
        });
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ---------- MOCK INCOMING MESSAGE (for demo/testing since app is unpublished) ----------
// Simulates what the real webhook would do when a customer messages you.
app.post("/mock-incoming", async (req, res) => {
  const { from, body, name } = req.body;
  try {
    await db.collection("messages").add({
      from,
      to: WHATSAPP_PHONE_NUMBER_ID,
      body,
      direction: "incoming",
      timestamp: Date.now(),
    });

    const contactRef = db.collection("contacts").doc(from);
    const contactDoc = await contactRef.get();
    if (!contactDoc.exists) {
      await contactRef.set({
        phone: from,
        name: name || from,
        tags: [],
        createdAt: Date.now(),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- SEND MESSAGE ----------
app.post("/send", async (req, res) => {
  const { to, body } = req.body;
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      { messaging_product: "whatsapp", to, type: "text", text: { body } },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
    );

    await db.collection("messages").add({
      from: WHATSAPP_PHONE_NUMBER_ID,
      to,
      body,
      direction: "outgoing",
      timestamp: Date.now(),
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// ---------- AI AUTO REPLY ----------
app.post("/generate-reply", async (req, res) => {
  const { customerMessage, customPrompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const systemPrompt = customPrompt || "You are a helpful customer support assistant. Keep replies short.";

    const result = await model.generateContent(
      `${systemPrompt}\n\nCustomer message: ${customerMessage}\n\nReply:`
    );
    const reply = result.response.text();

    await db.collection("ai_responses").add({
      customerMessage,
      reply,
      timestamp: Date.now(),
    });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- CONTACTS ----------
app.get("/contacts", async (req, res) => {
  const snap = await db.collection("contacts").orderBy("createdAt", "desc").get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});

app.post("/contacts", async (req, res) => {
  const { phone, name, tags } = req.body;
  await db.collection("contacts").doc(phone).set({
    phone, name, tags: tags || [], createdAt: Date.now(),
  });
  res.json({ success: true });
});

app.put("/contacts/:id", async (req, res) => {
  await db.collection("contacts").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

app.delete("/contacts/:id", async (req, res) => {
  await db.collection("contacts").doc(req.params.id).delete();
  res.json({ success: true });
});

// ---------- MESSAGES FOR A CONVERSATION ----------
app.get("/messages/:phone", async (req, res) => {
  const phone = req.params.phone;
  const fromSnap = await db.collection("messages").where("from", "==", phone).get();
  const toSnap = await db.collection("messages").where("to", "==", phone).get();
  const all = [...fromSnap.docs, ...toSnap.docs].map((d) => ({ id: d.id, ...d.data() }));
  const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());
  unique.sort((a, b) => a.timestamp - b.timestamp);
  res.json(unique);
});

// ---------- DASHBOARD STATS ----------
app.get("/stats", async (req, res) => {
  const [contacts, messages, aiResponses] = await Promise.all([
    db.collection("contacts").count().get(),
    db.collection("messages").count().get(),
    db.collection("ai_responses").count().get(),
  ]);

  res.json({
    totalContacts: contacts.data().count,
    totalConversations: contacts.data().count,
    totalMessages: messages.data().count,
    totalAIResponses: aiResponses.data().count,
  });
});

exports.api = functions.https.onRequest(app);