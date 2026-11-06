/**
 * Telegram Bot Notification Helper for Pruthviraj
 * Sends an instant alert with Agree/Reject inline buttons when someone applies to match.
 * Automatically attaches candidate's uploaded photo (file upload or URL) to Telegram!
 */
const DEFAULT_BOT_TOKEN = '9031585898:AAGJgrNHQAQ9veHO7_k_zRSrJt7Z0qc0mUM';
const DEFAULT_CHAT_ID = '7192300395';

export async function sendTelegramNotification({
  name,
  contact,
  contactType,
  photo,
  expectations,
  pitch,
  firstDateIdea,
  applicantId,
  origin,
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      '[Telegram Webhook] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured. Notification skipped.'
    );
    return { success: false, reason: 'Credentials not configured' };
  }

  // Auto-register live Vercel cloud webhook so button clicks trigger cloud API instantly
  if (origin && !origin.includes('localhost')) {
    const webhookUrl = `${origin}/api/telegram`;
    fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['callback_query', 'message'],
      }),
    })
      .then((r) => r.json())
      .then((d) => console.log('[Telegram Webhook Registered to Vercel]:', d))
      .catch((err) => console.warn('[Telegram Webhook Registration Error]:', err.message));
  }

  const dateStr = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Keep pitch and expectations bounded to fit Telegram's 1024-character caption limit
  const safePitch = pitch ? pitch.slice(0, 280) : '';
  const safeExpectations = expectations ? expectations.slice(0, 200) : '';

  const messageText = `
*WANNA DATE U // NEW MATCH PROPOSAL*

*Candidate:* ${escapeMarkdown(name || 'Anonymous')}
*Contact / Handle:* \`${escapeMarkdown(contact || 'Not provided')}\`
*Platform:* ${escapeMarkdown((contactType || 'contact').toUpperCase())}
*First Date Idea:* ${escapeMarkdown(firstDateIdea || 'Not specified')}
*Expectations:* ${escapeMarkdown(safeExpectations || 'None specified')}

*Personal Pitch:*
"${escapeMarkdown(safePitch || 'No note attached.')}"

*Submitted At:* ${dateStr} IST
*Candidate ID:* \`${applicantId || 'N/A'}\`

_Make your decision directly below:_
`.trim();

  // Exactly 2 decision buttons: Agree (Accept) and Reject (404)
  const inline_keyboard = [
    [
      { text: 'Agree (Accept)', callback_data: `accept:${applicantId}` },
      { text: 'Reject (404)', callback_data: `reject:${applicantId}` },
    ],
  ];

  const hasPhoto =
    photo &&
    typeof photo === 'string' &&
    photo.trim() &&
    photo !== 'default-avatar' &&
    photo !== 'avatar-1';

  // Option 1: Send Photo via Remote URL (http/https)
  if (hasPhoto && (photo.startsWith('http://') || photo.startsWith('https://'))) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photo.trim(),
          caption: messageText,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard },
        }),
      });
      const data = await response.json();
      if (data.ok) {
        console.log('[Telegram Photo Sent Successfully via URL]: message_id', data.result?.message_id);
        return { success: true, data };
      }
      console.warn('[Telegram sendPhoto URL failed, falling back to sendMessage]:', data);
    } catch (err) {
      console.warn('[Telegram sendPhoto URL error, falling back to sendMessage]:', err.message);
    }
  }

  // Option 2: Send Photo via Base64 Data URL (uploaded directly from device)
  if (hasPhoto && photo.startsWith('data:image/')) {
    try {
      const [meta, base64Data] = photo.split(',');
      if (base64Data) {
        const mime = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: mime });
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('caption', messageText);
        formData.append('parse_mode', 'Markdown');
        formData.append('reply_markup', JSON.stringify({ inline_keyboard }));
        formData.append('photo', blob, 'candidate-photo.jpg');

        const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.ok) {
          console.log('[Telegram Photo Sent Successfully via Base64]: message_id', data.result?.message_id);
          return { success: true, data };
        }
        console.warn('[Telegram sendPhoto Base64 failed, falling back to sendMessage]:', data);
      }
    } catch (err) {
      console.warn('[Telegram sendPhoto Base64 error, falling back to sendMessage]:', err.message);
    }
  }

  // Fallback: Send standard text message if no photo or sendPhoto fails
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error('[Telegram Webhook Error]:', data);
      return { success: false, error: data };
    }

    console.log('[Telegram Notification Sent Successfully]: message_id', data.result?.message_id);
    return { success: true, data };
  } catch (error) {
    console.error('[Telegram Webhook Fetch Failed]:', error);
    return { success: false, error: error.message };
  }
}

// Telegram Markdown v1 special character escape
function escapeMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/([_*`\[\]])/g, '\\$1');
}
