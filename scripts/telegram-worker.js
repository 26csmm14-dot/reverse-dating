const fs = require('fs');
const path = require('path');

// Read .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

loadEnv();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9031585898:AAGJgrNHQAQ9veHO7_k_zRSrJt7Z0qc0mUM';
const OWNER_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7192300395';

if (!BOT_TOKEN) {
  console.error('[Error] TELEGRAM_BOT_TOKEN is missing');
  process.exit(1);
}

const DATA_FILE = path.join(__dirname, '..', 'data', 'applicants.json');

function updateApplicantStatus(id, status) {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const index = list.findIndex((a) => a._id === id || a.id === id);
    if (index === -1) return null;

    list[index].status = status;
    list[index].decidedAt = new Date().toISOString();
    list[index].updatedAt = new Date().toISOString();

    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
    return list[index];
  } catch (err) {
    console.error('Error updating applicant store:', err);
    return null;
  }
}

async function tgRequest(method, payload) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API ${method} error:`, err.message);
    return { ok: false, error: err.message };
  }
}

console.log('[Telegram Polling Worker] Starting for Pruthviraj Match Bot...');
console.log(`[Status] Linked Owner Chat ID: ${OWNER_CHAT_ID}`);

let offset = 0;

async function pollUpdates() {
  while (true) {
    try {
      const data = await tgRequest('getUpdates', {
        offset,
        timeout: 20,
        allowed_updates: ['message', 'callback_query'],
      });

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          // Handle button clicks (Agree / Reject)
          if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
          }

          // Handle direct commands in chat
          if (update.message && update.message.text) {
            await handleMessage(update.message);
          }
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function handleCallbackQuery(query) {
  const queryId = query.id;
  const data = query.data || '';
  const message = query.message;
  const [action, applicantId] = data.split(':');

  if (!action || !applicantId) {
    await tgRequest('answerCallbackQuery', {
      callback_query_id: queryId,
      text: 'Invalid action payload',
    });
    return;
  }

  const isApproved = action === 'accept';
  const newStatus = isApproved ? 'accepted' : 'rejected';

  // Update applicant in data store
  const updated = updateApplicantStatus(applicantId, newStatus);
  const candName = updated ? updated.name : 'Candidate';

  // Answer callback alert on host phone
  await tgRequest('answerCallbackQuery', {
    callback_query_id: queryId,
    text: isApproved
      ? `Match agreed! ${candName} has been accepted.`
      : `${candName} proposal was rejected (404 screen).`,
    show_alert: true,
  });

  // Edit original Telegram message to show updated decision stamp
  if (message) {
    const originalText = message.text || '';
    const statusHeader = isApproved
      ? '*[DECISION: MATCH AGREED // ACCEPTED]*'
      : '*[DECISION: PASSED // REJECTED]*';

    const timeStr = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedText = `
${statusHeader}

${originalText}

*Decided by Pruthviraj:* ${timeStr} IST
`.trim();

    await tgRequest('editMessageText', {
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: updatedText,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [] }, // Remove buttons once decision is cast
    });
  }

  console.log(`[Decision Executed in Telegram] ${applicantId} -> ${newStatus}`);
}

async function handleMessage(msg) {
  const text = (msg.text || '').trim();
  const chatId = msg.chat.id;

  if (text === '/start' || text.toLowerCase() === 'help') {
    await tgRequest('sendMessage', {
      chat_id: chatId,
      text: `*WANNA DATE U // Match Bot Active!*\n\nWhen someone applies to match with you on the website, you will receive an instant notification here with their details and *[Agree]* / *[Reject]* buttons.\n\nYou can decide directly from Telegram without needing any admin page.\n\nType /status to view candidates summary.`,
      parse_mode: 'Markdown',
    });
  } else if (text === '/status') {
    try {
      const list = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) : [];
      const pending = list.filter((a) => a.status === 'pending');
      const accepted = list.filter((a) => a.status === 'accepted');
      const rejected = list.filter((a) => a.status === 'rejected');

      await tgRequest('sendMessage', {
        chat_id: chatId,
        text: `*WANNA DATE U // Candidate Roster*\n\nPending: *${pending.length}*\nAgreed (Accepted): *${accepted.length}*\nRejected: *${rejected.length}*\n\nTotal Evaluated: *${list.length}*`,
        parse_mode: 'Markdown',
      });
    } catch (e) {
      console.error('Status read error:', e);
    }
  }
}

pollUpdates();
