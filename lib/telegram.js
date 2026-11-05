/**
 * Telegram Bot Notification Helper for Pruthviraj
 * Sends an instant alert with Agree/Reject inline buttons when someone applies to match.
 */
export async function sendTelegramNotification({
  name,
  contact,
  contactType,
  expectations,
  pitch,
  firstDateIdea,
  applicantId,
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      '[Telegram Webhook] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in .env.local. Notification skipped.'
    );
    return { success: false, reason: 'Credentials not configured' };
  }

  const dateStr = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const messageText = `
*WANNA DATE U // NEW MATCH PROPOSAL*

*Candidate:* ${escapeMarkdown(name || 'Anonymous')}
*Contact / Handle:* \`${escapeMarkdown(contact || 'Not provided')}\`
*Platform:* ${escapeMarkdown((contactType || 'contact').toUpperCase())}
*First Date Idea:* ${escapeMarkdown(firstDateIdea || 'Not specified')}
*Expectations:* ${escapeMarkdown(expectations || 'None specified')}

*Personal Pitch:*
"${escapeMarkdown(pitch || 'No note attached.')}"

*Submitted At:* ${dateStr} IST
*Candidate ID:* \`${applicantId || 'N/A'}\`

_Make your decision directly below:_
`.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Agree (Accept)', callback_data: `accept:${applicantId}` },
              { text: 'Reject (404)', callback_data: `reject:${applicantId}` },
            ],
          ],
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Telegram Webhook Error]:', data);
      return { success: false, error: data };
    }

    console.log('[Telegram Notification Sent Successfully to Host]');
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
