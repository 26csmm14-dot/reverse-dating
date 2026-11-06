import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export const dynamic = 'force-dynamic';

const DEFAULT_BOT_TOKEN = '9031585898:AAGJgrNHQAQ9veHO7_k_zRSrJt7Z0qc0mUM';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;

async function tgRequest(method, payload) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API ${method} error:`, err);
    return { ok: false, error: err.message };
  }
}

export async function POST(request) {
  try {
    const update = await request.json().catch(() => ({}));

    // Handle button taps (Agree / Reject)
    if (update.callback_query) {
      const query = update.callback_query;
      const data = query.data || '';
      const [action, applicantId] = data.split(':');

      if (action && applicantId) {
        const isApproved = action === 'accept';
        const newStatus = isApproved ? 'accepted' : 'rejected';

        // Update database
        const updated = await dbService.update(applicantId, {
          status: newStatus,
          decidedAt: new Date(),
        });

        const candName = updated?.name || 'Candidate';

        // Answer callback query with mobile toast
        await tgRequest('answerCallbackQuery', {
          callback_query_id: query.id,
          text: isApproved
            ? `Match agreed! ${candName} has been accepted.`
            : `${candName} proposal was rejected (404 screen).`,
          show_alert: true,
        });

        // Edit original message to remove buttons and stamp decision
        if (query.message) {
          const originalText = query.message.text || '';
          const statusHeader = isApproved
            ? '*[DECISION: MATCH AGREED // ACCEPTED]*'
            : '*[DECISION: PASSED // REJECTED]*';

          const timeStr = new Date().toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
          });

          await tgRequest('editMessageText', {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            text: `${statusHeader}\n\n${originalText}\n\n*Decided by Pruthviraj:* ${timeStr} IST`,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [] },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram Bot Webhook Endpoint Active' });
}
