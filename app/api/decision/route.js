import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'accept' or 'reject'
    const id = searchParams.get('id');

    if (!action || !id) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#050505;color:#fff;text-align:center;padding:50px;">
          <h2>Invalid Parameters</h2>
          <p>Missing decision action or candidate id.</p>
        </body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const isApproved = action === 'accept';
    const newStatus = isApproved ? 'accepted' : 'rejected';

    const updated = await dbService.update(id, {
      status: newStatus,
      decidedAt: new Date(),
    });

    const candName = updated?.name || 'Candidate';
    const accentColor = isApproved ? '#10b981' : '#f43f5e';
    const title = isApproved ? 'MATCH ACCEPTED' : 'PROPOSAL DECLINED';
    const desc = isApproved
      ? `You have agreed to match with <b>${candName}</b>. Their browser has unlocked the accepted direct connection page!`
      : `You have declined the proposal from <b>${candName}</b>. Their browser will transition to the respectful 404 terminal.`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} // WANNA DATE U</title>
  <style>
    body {
      background: #090706;
      color: #e5e5e5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 36px 28px;
      max-width: 440px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      backdrop-filter: blur(20px);
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: ${accentColor}22;
      color: ${accentColor};
      border: 1px solid ${accentColor}44;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px 0;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #a3a3a3;
      margin: 0 0 28px 0;
    }
    .info {
      background: rgba(0,0,0,0.4);
      border-radius: 14px;
      padding: 12px;
      font-size: 12px;
      font-family: monospace;
      color: #ea580c;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${newStatus.toUpperCase()}</div>
    <h1>${title}</h1>
    <p>${desc}</p>
    <div class="info">Synced to MongoDB Atlas • Instant Live Push</div>
    <div style="font-size: 11px; color: #525252;">You can safely close this window.</div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Decision route error:', error);
    return new NextResponse('Server Error: ' + error.message, { status: 500 });
  }
}
