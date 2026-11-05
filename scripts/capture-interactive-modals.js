const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);

  let wsUrl;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9232/json/list', res => {
          let d = '';
          res.on('data', c => d += c);
          res.on('end', () => resolve(JSON.parse(d)));
        }).on('error', reject);
      });
      const p = res.find(x => x.type === 'page');
      if (p) {
        wsUrl = p.webSocketDebuggerUrl;
        break;
      }
    } catch(e) {}
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const cur = id++;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === cur) {
        ws.removeEventListener('message', h);
        resolve(m.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  // Set session cookie
  await send('Network.setCookie', {
    name: 'applicant_id',
    value: 'cand_preview_test',
    url: 'http://localhost:3000'
  });

  console.log('Navigating to dashboard with cookie...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard' });
  await new Promise(r => setTimeout(r, 3500));

  const authData = await send('Runtime.evaluate', {
    expression: `(async () => {
      const res = await fetch('/api/auth');
      return await res.json();
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Client fetch /api/auth result:', authData.result.value);

  // If not authenticated, authenticate via POST /api/auth directly from client!
  if (!authData.result.value?.authenticated) {
    console.log('Authenticating from client via POST /api/auth...');
    await send('Runtime.evaluate', {
      expression: `(async () => {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Ananya Sharma',
            contactType: 'instagram',
            contact: '@ananya_sharma',
            expectations: 'Looking for thoughtful conversations and rooftop coffee dates.'
          })
        });
        location.reload();
      })()`,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 4000));
  }

  // Open profile modal via top button
  console.log('Clicking Profile Button...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const profBtn = document.querySelector('button[title*="Profile"]') || 
                      Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Ananya') || b.querySelector('svg.lucide-user'));
      if (profBtn) {
        profBtn.click();
        return 'clicked profile';
      }
      return 'not found: ' + document.querySelector('header')?.innerText;
    })()`
  });
  console.log('Profile Click result:', clickRes);
  await new Promise(r => setTimeout(r, 1500));

  const snapProfile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\brain\\a546f0c5-b1d7-4ca7-8b25-64702e9c9bba\\preview-profile-modal-orange.png', Buffer.from(snapProfile.data, 'base64'));
  console.log('Saved preview-profile-modal-orange.png');

  ws.close();
  chrome.kill();
}

test().catch(console.error);
