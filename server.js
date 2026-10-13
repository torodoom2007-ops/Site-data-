const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables (יוגדרו ב-Render)
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API לדיווח אנליטיקס
app.post('/api/track', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !TG_TOKEN || !TG_CHAT_ID) {
      return res.status(400).json({ ok: false });
    }

    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Track error:', err.message);
    res.status(500).json({ ok: false });
  }
});

// כל שאר הבקשות מחזירות את index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MemberFlow running on port ${PORT}`);
});
