const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://26csmm14_db_user:btRXu57YKBaPR82i@cluster0.zhvganu.mongodb.net/reverse_dating?retryWrites=true&w=majority';

const DATA_FILE = path.join(__dirname, '..', 'data', 'applicants.json');

// Connect to MongoDB Atlas
let mongoConnected = false;
const ApplicantSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', ApplicantSchema);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    mongoConnected = true;
    console.log('[Worker] Connected to MongoDB Atlas for real-time decision syncing!');
  })
  .catch((e) => {
    console.warn('[Worker] MongoDB Atlas connection warning:', e.message);
  });

async function updateApplicantStatus(id, status) {
  let doc = null;

  // 1. Update in MongoDB Atlas
  if (mongoConnected) {
    try {
      doc = await Applicant.findByIdAndUpdate(
        id,
        { $set: { status, decidedAt: new Date() } },
        { new: true }
      );
      if (!doc) {
        doc = await Applicant.findOneAndUpdate(
          { _id: id },
          { $set: { status, decidedAt: new Date() } },
          { new: true }
        );
      }
      if (doc) {
        console.log(`[Worker] Updated ${doc.name || id} to ${status} in MongoDB Atlas`);
      }
    } catch (err) {
      console.warn('[Worker] Atlas update warning:', err.message);
    }
  }

  // 2. Also update local store if available
  try {
    if (fs.existsSync(DATA_FILE)) {
      const list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      const index = list.findIndex((a) => a._id === id || a.id === id);
      if (index !== -1) {
        list[index].status = status;
        list[index].decidedAt = new Date().toISOString();
        list[index].updatedAt = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
        if (!doc) doc = list[index];
      }
    }
  } catch (err) {
    console.error('[Worker] Error updating local store:', err.message);
  }

  return doc;
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

console.log('[Telegram Polling Worker] Active and listening for Pruthviraj Match decisions...');
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

  // Update applicant in database
  const updated = await updateApplicantStatus(applicantId, newStatus);
  const candName = updated ? updated.name : 'Candidate';

  // Answer callback alert on host phone
  await tgRequest('answerCallbackQuery', {
    callback_query_id: queryId,
    text: isApproved
      ? `Match agreed! ${candName} has been accepted.`
      : `${candName} proposal was rejected (404 screen).`,
    show_alert: true,
  });

  // Edit original message to remove buttons and stamp decision
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

    await tgRequest('editMessageText', {
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: `${statusHeader}\n\n${originalText}\n\n*Decided by Pruthviraj:* ${timeStr} IST`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [] },
    });
  }
}

async function handleMessage(message) {
  const text = message.text ? message.text.trim().toLowerCase() : '';
  const chatId = message.chat.id;

  if (String(chatId) !== String(OWNER_CHAT_ID)) {
    return;
  }

  if (text === '/start' || text === '/status' || text === '/help') {
    let stats = { total: 0, pending: 0, accepted: 0, rejected: 0 };
    if (mongoConnected) {
      try {
        stats.total = await Applicant.countDocuments();
        stats.pending = await Applicant.countDocuments({ status: 'pending' });
        stats.accepted = await Applicant.countDocuments({ status: 'accepted' });
        stats.rejected = await Applicant.countDocuments({ status: 'rejected' });
      } catch (e) {}
    }

    const reply = `
*WANNA DATE U // REVERSE DATING BOT STATUS*

*Host:* Pruthviraj (NCC Rifle Shooter & Full-Stack Developer)
*Total Applicants in Database:* ${stats.total}
*Pending Decision:* ${stats.pending}
*Accepted Matches:* ${stats.accepted}
*Rejected / 404:* ${stats.rejected}

You will receive an instant push notification here whenever someone submits a proposal.
`.trim();

    await tgRequest('sendMessage', {
      chat_id: chatId,
      text: reply,
      parse_mode: 'Markdown',
    });
  }
}

pollUpdates();
