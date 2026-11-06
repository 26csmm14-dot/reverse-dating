const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\brain\\a546f0c5-b1d7-4ca7-8b25-64702e9c9bba';

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--disable-gpu',
    '--window-size=1280,900',
    'about:blank'
  ]);

  let wsUrl;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9234/json/list', res => {
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
  await send('Network.enable');

  // Set session cookie
  await send('Network.setCookie', {
    name: 'applicant_id',
    value: 'cand_preview_test',
    url: 'http://localhost:3000'
  });

  await send('Page.navigate', { url: 'http://localhost:3000/dashboard' });
  await new Promise(r => setTimeout(r, 3500));

  // Open profile modal
  await send('Runtime.evaluate', {
    expression: `(() => {
      const profBtn = document.querySelector('button[title*="Profile"]') || 
                      Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Ananya') || b.querySelector('svg.lucide-user'));
      if (profBtn) profBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  // Switch to edit mode
  await send('Runtime.evaluate', {
    expression: `(() => {
      const editBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Edit My Details'));
      if (editBtn) editBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  // Enter invalid data (numbers in name) and save
  await send('Runtime.evaluate', {
    expression: `(() => {
      const nameInput = document.querySelector('input[placeholder*="call you"]');
      if (nameInput) {
        // Manually trigger error via validation function or bad input
        const form = document.querySelector('form');
        if (form) {
          nameInput.value = 'User1234';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.click();
        }
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const snapVal = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot-validation-error.png'), Buffer.from(snapVal.data, 'base64'));
  console.log('Saved screenshot-validation-error.png');

  ws.close();
  chrome.kill();
}

capture().catch(console.error);
