# WhatsApp CRM

React (Vite) frontend + Firebase Cloud Functions backend + Firestore database.

## What to fill in before running

1. `functions/index.js` — top of file: paste WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN (any string you choose), OPENAI_API_KEY
2. `client/src/firebase/config.js` — paste your Firebase web app config
3. `.firebaserc` — paste your Firebase project ID
4. `client/vite.config.js` — paste your Firebase project ID in the proxy URL (for local dev only)

## Setup steps

```
npm install -g firebase-tools
firebase login

cd functions
npm install

cd ../client
npm install
```

## Local testing

```
# terminal 1 (from project root)
firebase emulators:start --only functions

# terminal 2
cd client
npm run dev
```

## Deploy

```
cd client
npm run build

cd ..
firebase deploy
```

After deploy, your live URL + API will be at:
`https://YOUR_PROJECT_ID.web.app`
`https://YOUR_PROJECT_ID.web.app/api/...`

## Webhook setup in Meta

Once deployed, go to Meta App -> WhatsApp -> Configuration -> Webhook:
- Callback URL: `https://YOUR_PROJECT_ID.web.app/api/webhook`
- Verify Token: same string you set as WHATSAPP_VERIFY_TOKEN
- Subscribe to: `messages`

## Firestore

Enable Firestore in Firebase Console (test mode is fine for dev). Collections used:
- `contacts`
- `messages`
- `ai_responses`
