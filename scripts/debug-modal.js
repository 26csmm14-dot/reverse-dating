const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000/dashboard'
  ]);
  let wsUrl;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await new Promise((res, rej) => http.get('http://127.0.0.1:9231/json/list', r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      const p = res.find(x => x.type === 'page');
      if (p) {
        wsUrl = p.webSocketDebuggerUrl;
        break;
      }
    } catch(e){}
  }
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    const h = e => {
      const m = JSON.parse(e.data);
      if (m.id === cur) {
        ws.removeEventListener('message', h);
        res(m.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') {
      console.error('Exception thrown in page:', m.params.exceptionDetails);
    }
    if (m.method === 'Runtime.consoleAPICalled') {
      console.log('Page console:', m.params.args.map(a => a.value));
    }
  });
  await new Promise(r => setTimeout(r, 3500));
  
  const fiberCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('#cta-interested');
      const keys = Object.keys(btn);
      const reactKey = keys.find(k => k.startsWith('__reactProps') || k.startsWith('__reactFiber'));
      return { keys, reactKey, hasProps: !!btn[reactKey] };
    })()`,
    returnByValue: true
  });
  console.log('React hydration check:', fiberCheck.result.value);

  // Click it with pointerdown + click
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('#cta-interested');
      if (!btn) return 'no btn';
      btn.scrollIntoView();
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return 'dispatched';
    })()`
  });
  console.log('Dispatch result:', clickRes);
  await new Promise(r => setTimeout(r, 1500));

  const modalCheck = await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("form").length'
  });
  console.log('Forms in DOM:', modalCheck.result.value);

  ws.close();
  chrome.kill();
}
test().catch(console.error);
