const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\brain\\a546f0c5-b1d7-4ca7-8b25-64702e9c9bba';
const DB_PATH = 'C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\scratch\\reverse-dating\\data\\applicants.json';

// Ensure test applicant exists
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
let applicant = db.find(a => a._id === 'cand_preview_test');
if (!applicant) {
  applicant = {
    _id: 'cand_preview_test',
    name: 'Ananya Sharma',
    contactType: 'instagram',
    contact: '@ananya_sharma',
    expectations: 'Looking for thoughtful conversations, rooftop coffee dates, and fun weekend adventures.',
    status: 'viewing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.push(applicant);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

async function run() {
  console.log('Launching Chrome for clean final previews...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--window-size=1440,920',
    'about:blank'
  ]);

  let wsUrl;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9228/json/list', res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      const p = res.find(x => x.type === 'page');
      if (p) {
        wsUrl = p.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Network.enable');
  await send('Runtime.enable');

  async function takeScreenshot(fileName) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      const outPath = path.join(ARTIFACT_DIR, fileName);
      fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
      console.log(`Saved: ${fileName}`);
    }
  }

  // 1. Hero
  console.log('1. Navigating to Hero...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard' });
  await new Promise(r => setTimeout(r, 2200));
  await takeScreenshot('preview-1-hero-final.png');

  // 2. 3D Cards
  console.log('2. Scrolling to 3D Cards...');
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#achievements')?.scrollIntoView({ behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot('preview-2-3d-cards-final.png');

  // 3. Proposal Modal (Orange Glass)
  console.log('3. Navigating to Proposal Modal...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard?modal=true' });
  await new Promise(r => setTimeout(r, 2200));
  await takeScreenshot('preview-3-proposal-modal-final.png');

  // 4. Profile Modal (Orange Glass)
  console.log('4. Navigating to Profile Modal...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard?profile=true' });
  await new Promise(r => setTimeout(r, 2200));
  await takeScreenshot('preview-4-profile-modal-final.png');

  // 5. Pitch CTA Section
  console.log('5. Navigating to Pitch CTA...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard' });
  await new Promise(r => setTimeout(r, 1500));
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#pitch')?.scrollIntoView({ behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot('preview-5-pitch-cta-final.png');

  // 6. Footer
  console.log('6. Scrolling to Footer...');
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot('preview-6-footer-final.png');

  // 7. Accepted Page
  console.log('7. Navigating to Accepted Page...');
  await send('Page.navigate', { url: 'http://localhost:3000/status/accepted' });
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('preview-7-accepted-final.png');

  // 8. Rejected Page
  console.log('8. Navigating to 404 Rejected Page...');
  await send('Page.navigate', { url: 'http://localhost:3000/status/404-rejected' });
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('preview-8-rejected-final.png');

  console.log('All 8 preview captures completed successfully!');
  ws.close();
  chrome.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
