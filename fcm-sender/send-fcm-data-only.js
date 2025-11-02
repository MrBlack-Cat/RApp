const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const SA_PATH = path.resolve(__dirname, 'service-account.json');
if (!fs.existsSync(SA_PATH)) {
  console.error('service-account.json not found. Put it next to this script.');
  process.exit(1);
}
const SA_JSON = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
const PROJECT_ID = SA_JSON.project_id;
const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

async function getAccessToken() {
  const auth = new GoogleAuth({ credentials: SA_JSON, scopes: SCOPES });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('No access token');
  return token;
}

async function sendDataOnlyToToken(deviceToken, data) {
  const accessToken = await getAccessToken();
  const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

  const body = {
    message: {
      token: deviceToken,
      data: {
        title: data.title ?? 'Title',
        body:  data.body  ?? 'Body',
        screen: data.screen ?? '',
        id: data.id ?? '',
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    console.error('FCM error:', json);
    throw new Error(JSON.stringify(json));
  }
  console.log('FCM OK:', json);
}


const [,, token, title, body, screen, id] = process.argv;
if (!token) {
  console.error('Usage: node send-fcm-data-only.js <FCM_TOKEN> [title] [body] [screen] [id]');
  process.exit(1);
}
sendDataOnlyToToken(token, { title, body, screen, id })
  .catch(e => { console.error(e); process.exit(1); });
