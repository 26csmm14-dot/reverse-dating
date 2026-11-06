const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\brain\\a546f0c5-b1d7-4ca7-8b25-64702e9c9bba';

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9236',
    '--disable-gpu',
    '--window-size=1280,950',
    'http://localhost:3000/dashboard'
  ]);

  let wsUrl;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9236/json/list', res => {
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
  await new Promise(r => setTimeout(r, 4000));

  // Open proposal modal
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#cta-interested')?.click()`
  });
  await new Promise(r => setTimeout(r, 1200));

  // Enter invalid whitespace to bypass native required and trigger custom validation banner
  await send('Runtime.evaluate', {
    expression: `(() => {
      const inputs = document.querySelectorAll('form input');
      if (inputs[0]) {
        inputs[0].value = '   ';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = '   ';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) submitBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const snapVal = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot-validation-error.png'), Buffer.from(snapVal.data, 'base64'));
  console.log('Saved custom validation error banner screenshot');

  ws.close();
  chrome.kill();
}

capture().catch(console.error);
