const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9238',
    '--window-size=1200,900',
    'http://localhost:3000/login'
  ]);

  let wsUrl;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9238/json/list', res => {
          let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
        }).on('error', reject);
      });
      const p = res.find(x => x.type === 'page');
      if (p) { wsUrl = p.webSocketDebuggerUrl; break; }
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
  await new Promise(r => setTimeout(r, 3500));

  // Ensure opacity is 1 on motion divs
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('div').forEach(el => {
        if (el.style.opacity === '0') el.style.opacity = '1';
        if (el.style.transform && el.style.transform.includes('translateY')) el.style.transform = 'none';
      });
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\brain\\a546f0c5-b1d7-4ca7-8b25-64702e9c9bba\\screenshot-onboarding-login.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved screenshot-onboarding-login.png');

  ws.close();
  chrome.kill();
}

capture().catch(console.error);
