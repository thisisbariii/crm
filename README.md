# README.md Content

Copy this entire text and replace your current `README.md` file:

---

```markdown
# AI-Powered Business Messaging Platform

A full-stack WhatsApp CRM with AI-powered auto-replies built with React, Firebase, and Gemini AI.

## 🚀 Live Demo

- **Live App:** https://crm-sigma-lovat.vercel.app
- **API Base URL:** https://us-central1-nida-ad6ec.cloudfunctions.net/api

## 📋 Features

- **Shared Inbox** - View all WhatsApp conversations in one place
- **Contact Management** - Add, search, and delete contacts
- **AI Auto-Replies** - Generate smart replies using Google Gemini AI
- **Dashboard** - Real-time stats (contacts, conversations, messages, AI replies)
- **WhatsApp Integration** - Send and receive messages via WhatsApp Cloud API
- **Mock Webhook** - Simulate incoming messages for demo (unpublished app fallback)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Backend | Express.js + Firebase Cloud Functions |
| Database | Firebase Firestore |
| Messaging | WhatsApp Cloud API |
| AI | Google Gemini API |
| Hosting | Vercel (Frontend) + Google Cloud (Backend) |

## 📁 Project Structure

```
wa-crm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── firebase/      # Firebase config
│   │   ├── pages/         # Dashboard, Contacts, Inbox
│   │   ├── App.jsx
│   │   ├── api.js         # API client
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── functions/              # Firebase Cloud Functions (backend)
│   ├── index.js           # Express app with all routes
│   ├── package.json
│   └── env-vars.yaml      # Environment variables (excluded from git)
├── .firebaserc             # Firebase project config
├── firebase.json           # Firebase settings
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v20+)
- Firebase account (Blaze plan required for Cloud Functions)
- Meta Developer account (WhatsApp API)
- Google Gemini API key (free)

### 1. Clone the Repository

```bash
git clone https://github.com/thisisbariii/crm.git
cd crm
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Firestore Database** (start in test mode)
3. Go to Project Settings → Add App → Web → copy config
4. Paste config in `client/src/firebase/config.js`
5. Update `.firebaserc` with your project ID

### 3. Backend Setup

```bash
cd functions
npm install
```

Create `env-vars.yaml` in the `functions` folder:

```yaml
WHATSAPP_TOKEN: "your_whatsapp_token"
WHATSAPP_PHONE_NUMBER_ID: "your_phone_number_id"
WHATSAPP_VERIFY_TOKEN: "your_verify_token"
GEMINI_API_KEY: "your_gemini_api_key"
```

### 4. Deploy Backend (Google Cloud Functions)

```bash
gcloud auth activate-service-account --key-file="path/to/service-account.json"
gcloud config set project your-project-id
gcloud functions deploy api \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --entry-point api \
  --memory 256MB \
  --timeout 60s \
  --env-vars-file env-vars.yaml
```

### 5. Frontend Setup

```bash
cd ../client
npm install
npm run dev  # Runs locally at http://localhost:5173
```

### 6. Deploy Frontend (Vercel)

```bash
npm install -g vercel
vercel
```

Follow the prompts (accept defaults).

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `WHATSAPP_TOKEN` | Meta WhatsApp access token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token |
| `GEMINI_API_KEY` | Google Gemini API key |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get all contacts |
| POST | `/contacts` | Add new contact |
| DELETE | `/contacts/:id` | Delete contact |
| GET | `/messages/:phone` | Get conversation |
| POST | `/send` | Send WhatsApp message |
| POST | `/generate-reply` | Generate AI reply |
| GET | `/stats` | Dashboard stats |
| POST | `/mock-incoming` | Simulate incoming message (demo) |
| GET | `/webhook` | WhatsApp webhook verification |

## 🧠 AI Integration

Uses **Google Gemini** (free tier) for auto-replies:

- Configurable system prompt per conversation
- Generates context-aware responses
- Swappable with OpenAI (same interface)

## 📝 Notes on WhatsApp Integration

- **Unpublished App:** Meta requires App Review for production webhook delivery
- **Mock Endpoint:** `/mock-incoming` simulates webhook behavior for demo purposes (per assessment fallback guidance)
- **24-Hour Window:** WhatsApp requires customer-initiated conversation within 24h for free-form replies
- **Test Mode:** Only verified recipient numbers can receive messages

## 🧪 Testing

### Test Mock Incoming

```bash
curl -X POST "https://test.net/api/mock-incoming" \
  -H "Content-Type: application/json" \
  -d '{"from":"919876543210","body":"Hi, I need help","name":"Test Customer"}'
```

### Check Contacts

```bash
curl "https://test.cloudfunctions.net/api/contacts"
```

## 🛡️ Security

- **Never commit** `.env`, `env-vars.yaml`, or service account keys
- WhatsApp tokens are temporary (refresh every 24h or use permanent token)
- Firestore security rules should be configured for production

## 🤖 AI Tools Used

- **Claude** - Primary coding assistant (code generation, debugging, architecture)
- **Gemini** - LLM provider for auto-reply feature

## 📄 License

This project was created as part of an assessment for **Cybersync Technologies**.

## 👤 Author

**Abdul Basha Shaikh**
- GitHub: [@thisisbariii](https://github.com/thisisbariii)

---

#

---

**Built with ❤️ for Cybersync Technologies**
```

---

## How to Update README and Push

```bash
# Navigate to project root
cd "C:\Users\badsh\Downloads\wa-crm (1)\wa-crm"

# Replace README.md with the content above
# (Open README.md in Notepad, paste the content, save)

# Check git status
git status

# Add and commit
git add README.md
git commit -m "Update README with full documentation"

# Push to GitHub
git push origin main
```

