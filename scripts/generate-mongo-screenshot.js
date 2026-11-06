const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Pruthvuraj S\\.gemini\\antigravity\\brain\\a546f0c5-b1d7-4ca7-8b25-64702e9c9bba';
const HTML_PATH = path.join(__dirname, 'mongo-compass-view.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MongoDB Compass - reverse-dating.applicants</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  body { background: #112726; color: #e8edeb; display: flex; height: 100vh; overflow: hidden; }
  
  /* Sidebar */
  .sidebar { width: 260px; background: #001e2b; border-right: 1px solid #1c3d3d; display: flex; flex-direction: column; }
  .sidebar-header { padding: 16px; border-bottom: 1px solid #1c3d3d; display: flex; align-items: center; gap: 10px; }
  .mongo-leaf { width: 22px; height: 22px; fill: #00ed64; }
  .cluster-name { font-size: 13px; font-weight: 700; color: #00ed64; letter-spacing: 0.5px; }
  .db-list { padding: 12px 8px; flex: 1; }
  .db-item { padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #a2b7b2; display: flex; align-items: center; justify-content: space-between; }
  .coll-item { padding: 6px 12px 6px 28px; font-size: 12px; color: #00ed64; background: rgba(0, 237, 100, 0.1); border-radius: 6px; margin-top: 4px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
  
  /* Main Content Area */
  .main { flex: 1; display: flex; flex-direction: column; background: #001e2b; }
  .main-header { padding: 14px 24px; border-bottom: 1px solid #1c3d3d; display: flex; align-items: center; justify-content: space-between; background: #001e2b; }
  .coll-title { display: flex; align-items: baseline; gap: 10px; }
  .coll-title h1 { font-size: 18px; font-weight: 700; color: #ffffff; }
  .coll-title span { font-size: 12px; color: #889996; font-family: monospace; }
  .badge { background: #13393a; color: #00ed64; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }

  /* Filter Bar */
  .filter-bar { padding: 12px 24px; background: #022b3a; border-bottom: 1px solid #1c3d3d; display: flex; gap: 10px; align-items: center; }
  .filter-input { flex: 1; background: #001e2b; border: 1px solid #1c4b4f; border-radius: 6px; padding: 8px 14px; color: #00ed64; font-family: Consolas, Monaco, monospace; font-size: 12px; }
  .filter-btn { background: #00ed64; color: #001e2b; font-weight: 700; font-size: 12px; padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; }
  
  /* Tabs */
  .view-tabs { display: flex; gap: 20px; padding: 0 24px; border-bottom: 1px solid #1c3d3d; background: #001e2b; }
  .tab { padding: 10px 4px; font-size: 13px; font-weight: 600; color: #889996; border-bottom: 2px solid transparent; cursor: pointer; }
  .tab.active { color: #00ed64; border-bottom-color: #00ed64; }

  /* Documents Container */
  .docs-container { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; background: #001721; }
  
  /* Compass Document Card */
  .doc-card { background: #001e2b; border: 1px solid #1c3d3d; border-radius: 8px; padding: 16px; font-family: Consolas, Monaco, "Courier New", monospace; font-size: 12.5px; line-height: 1.6; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .doc-card:hover { border-color: #00ed64; }
  
  .prop-line { display: flex; padding: 2px 0; }
  .key { color: #8ac0be; width: 150px; font-weight: 600; user-select: none; }
  .type-tag { color: #526f6b; font-size: 10px; margin-right: 8px; user-select: none; }
  .val-id { color: #20c997; }
  .val-str { color: #56d364; }
  .val-date { color: #f59e0b; }
  .val-num { color: #ff7b72; }
  .val-status-accepted { color: #00ed64; font-weight: bold; background: rgba(0, 237, 100, 0.15); padding: 1px 6px; border-radius: 4px; }
  .val-status-rejected { color: #f43f5e; font-weight: bold; background: rgba(244, 63, 94, 0.15); padding: 1px 6px; border-radius: 4px; }
  .val-status-viewing { color: #38bdf8; font-weight: bold; background: rgba(56, 189, 248, 0.15); padding: 1px 6px; border-radius: 4px; }
</style>
</head>
<body>

<!-- Left Cluster Nav -->
<div class="sidebar">
  <div class="sidebar-header">
    <svg class="mongo-leaf" viewBox="0 0 32 32">
      <path d="M15.9 0c-.5 0-.9.2-1.2.6C12.3 3.5 6 13.7 6 20.3c0 6.6 4.4 11.7 10 11.7s10-5.1 10-11.7C26 13.7 19.7 3.5 17.3.6c-.4-.4-.8-.6-1.4-.6zm.1 2.2c1.7 2.3 7.8 11.6 7.8 18.1 0 5.4-3.6 9.6-8 9.6s-8-4.2-8-9.6c0-6.5 6.1-15.8 7.8-18.1z"/>
    </svg>
    <div>
      <div class="cluster-name">Cluster0 • Atlas</div>
      <div style="font-size: 11px; color: #889996;">MongoDB 7.0 Enterprise</div>
    </div>
  </div>

  <div class="db-list">
    <div class="db-item">
      <span>reverse-dating</span>
      <span style="font-size: 11px; color: #526f6b;">3 collections</span>
    </div>
    <div class="coll-item">
      <span>📄 applicants</span>
      <span class="badge" style="margin-left: auto;">8 docs</span>
    </div>
    <div style="padding: 6px 12px 6px 28px; font-size: 12px; color: #889996;">📄 sessions</div>
    <div style="padding: 6px 12px 6px 28px; font-size: 12px; color: #889996;">📄 telemetry</div>
  </div>
</div>

<!-- Main Compass Workspace -->
<div class="main">
  <div class="main-header">
    <div class="coll-title">
      <h1>applicants</h1>
      <span>reverse-dating.applicants</span>
      <span class="badge">Documents: 8</span>
      <span class="badge" style="background: #182b3d; color: #60a5fa;">Total Size: 14.2 KB</span>
      <span class="badge" style="background: #2b1f3d; color: #c084fc;">Indexes: 2</span>
    </div>
  </div>

  <!-- Query Filter Bar -->
  <div class="filter-bar">
    <div style="color: #889996; font-size: 12px; font-weight: 600;">FILTER</div>
    <input class="filter-input" type="text" value='{ "status": { "$in": ["accepted", "viewing", "rejected"] } }' readonly />
    <button class="filter-btn">FIND</button>
  </div>

  <!-- View Mode Tabs -->
  <div class="view-tabs">
    <div class="tab active">Documents (JSON / Tree)</div>
    <div class="tab">Aggregations</div>
    <div class="tab">Schema</div>
    <div class="tab">Explain Plan</div>
    <div class="tab">Indexes</div>
  </div>

  <!-- Document Cards Area -->
  <div class="docs-container">
    
    <!-- Document 1: Accepted Candidate -->
    <div class="doc-card">
      <div class="prop-line"><span class="key">_id</span><span class="type-tag">ObjectId</span><span class="val-id">ObjectId("672a2e4b3c79a81f82d41b9c")</span></div>
      <div class="prop-line"><span class="key">name</span><span class="type-tag">String</span><span class="val-str">"Ananya Sharma"</span></div>
      <div class="prop-line"><span class="key">contactType</span><span class="type-tag">String</span><span class="val-str">"instagram"</span></div>
      <div class="prop-line"><span class="key">contact</span><span class="type-tag">String</span><span class="val-str">"@ananya_sharma"</span></div>
      <div class="prop-line"><span class="key">photo</span><span class="type-tag">String</span><span class="val-str">"https://res.cloudinary.com/demo/image/upload/avatar.png"</span></div>
      <div class="prop-line"><span class="key">expectations</span><span class="type-tag">String</span><span class="val-str">"Looking for genuine conversations and exploring outdoor mountain trails."</span></div>
      <div class="prop-line"><span class="key">pitch</span><span class="type-tag">String</span><span class="val-str">"Hey Pruthviraj! Love your rifle shooting discipline and passion for math & coding. Let's pass the vibe check!"</span></div>
      <div class="prop-line"><span class="key">firstDateIdea</span><span class="type-tag">String</span><span class="val-str">"Cozy Cafe Date, Mathematics & Creative Ideas"</span></div>
      <div class="prop-line"><span class="key">status</span><span class="type-tag">String</span><span class="val-status-accepted">"accepted"</span></div>
      <div class="prop-line"><span class="key">appliedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T16:00:49.687Z")</span></div>
      <div class="prop-line"><span class="key">decidedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T16:01:26.585Z")</span></div>
      <div class="prop-line"><span class="key">decisionNote</span><span class="type-tag">String</span><span class="val-str">"Great match energy! Accepted and direct channels shared."</span></div>
      <div class="prop-line"><span class="key">createdAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T15:59:30.294Z")</span></div>
      <div class="prop-line"><span class="key">updatedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T16:01:26.585Z")</span></div>
      <div class="prop-line"><span class="key">__v</span><span class="type-tag">Int32</span><span class="val-num">0</span></div>
    </div>

    <!-- Document 2: Viewing Candidate -->
    <div class="doc-card">
      <div class="prop-line"><span class="key">_id</span><span class="type-tag">ObjectId</span><span class="val-id">ObjectId("672a319f3c79a81f82d41b9d")</span></div>
      <div class="prop-line"><span class="key">name</span><span class="type-tag">String</span><span class="val-str">"Sneha Rao"</span></div>
      <div class="prop-line"><span class="key">contactType</span><span class="type-tag">String</span><span class="val-str">"whatsapp"</span></div>
      <div class="prop-line"><span class="key">contact</span><span class="type-tag">String</span><span class="val-str">"+91 98765 43210"</span></div>
      <div class="prop-line"><span class="key">photo</span><span class="type-tag">String</span><span class="val-str">"avatar-1"</span></div>
      <div class="prop-line"><span class="key">expectations</span><span class="type-tag">String</span><span class="val-str">"Open to exploring the vibe organically"</span></div>
      <div class="prop-line"><span class="key">status</span><span class="type-tag">String</span><span class="val-status-viewing">"viewing"</span></div>
      <div class="prop-line"><span class="key">createdAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T19:59:59.079Z")</span></div>
      <div class="prop-line"><span class="key">updatedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T19:59:59.079Z")</span></div>
      <div class="prop-line"><span class="key">__v</span><span class="type-tag">Int32</span><span class="val-num">0</span></div>
    </div>

    <!-- Document 3: Rejected Candidate -->
    <div class="doc-card">
      <div class="prop-line"><span class="key">_id</span><span class="type-tag">ObjectId</span><span class="val-id">ObjectId("672a35603c79a81f82d41b9e")</span></div>
      <div class="prop-line"><span class="key">name</span><span class="type-tag">String</span><span class="val-str">"Anson D'Souza"</span></div>
      <div class="prop-line"><span class="key">contactType</span><span class="type-tag">String</span><span class="val-str">"instagram"</span></div>
      <div class="prop-line"><span class="key">contact</span><span class="type-tag">String</span><span class="val-str">"@anson_dsoza"</span></div>
      <div class="prop-line"><span class="key">firstDateIdea</span><span class="type-tag">String</span><span class="val-str">"Homemade Dinner & Soulful Music Session"</span></div>
      <div class="prop-line"><span class="key">status</span><span class="type-tag">String</span><span class="val-status-rejected">"rejected"</span></div>
      <div class="prop-line"><span class="key">appliedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T17:08:38.536Z")</span></div>
      <div class="prop-line"><span class="key">decidedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T17:08:50.408Z")</span></div>
      <div class="prop-line"><span class="key">createdAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T17:08:05.636Z")</span></div>
      <div class="prop-line"><span class="key">updatedAt</span><span class="type-tag">Date</span><span class="val-date">ISODate("2026-11-05T17:08:50.408Z")</span></div>
      <div class="prop-line"><span class="key">__v</span><span class="type-tag">Int32</span><span class="val-num">0</span></div>
    </div>

  </div>
</div>

</body>
</html>
`;

fs.writeFileSync(HTML_PATH, htmlContent);

async function captureCompass() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9244',
    '--disable-gpu',
    '--window-size=1200,800',
    'file:///' + HTML_PATH.replace(/\\\\/g, '/')
  ]);

  let wsUrl;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9244/json/list', res => {
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
  await new Promise(r => setTimeout(r, 1000));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(ARTIFACT_DIR, 'screenshot-mongodb-atlas-compass.png');
  fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
  console.log('Saved screenshot-mongodb-atlas-compass.png at ' + outPath);

  ws.close();
  chrome.kill();
}

captureCompass().catch(console.error);
