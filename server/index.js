const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 8787;

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. Set it in .env before running.');
}

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

// Initialize Google GenAI SDK if key present
let googleAI = null;
if (GOOGLE_KEY) {
  try {
    const { GoogleGenAI } = require('@google/genai');
    googleAI = new GoogleGenAI({ apiKey: GOOGLE_KEY });
    console.log('Google GenAI SDK initialized with key.');
  } catch (err) {
    console.warn('Failed to initialize Google GenAI SDK:', err.message);
  }
}

// Try to use langchain if it's installed. If not, we'll fall back to calling OpenAI REST directly.
let useLangchain = false;
let LangchainOpenAI = null;
let ConversationChain = null;
let lcLLM = null;
let lcConv = null;
try {
  // Attempt to require langchain modules
  LangchainOpenAI = require('langchain/llms/openai').OpenAI;
  ConversationChain = require('langchain/chains').ConversationChain;
  useLangchain = true;
  console.log('langchain is available — server will use langchain for LLM calls.');
  // Initialize langchain LLM and conversation chain (if API key present)
  if (OPENAI_KEY) {
    lcLLM = new LangchainOpenAI({ openAIApiKey: OPENAI_KEY, temperature: 0.6 });
    lcConv = new ConversationChain({ llm: lcLLM });
  } else {
    console.warn('OPENAI_API_KEY not set — langchain initialized but will fail until key is provided.');
  }
} catch (err) {
  // langchain not installed — we'll continue with REST fallback
  useLangchain = false;
  console.log('langchain not found — falling back to direct OpenAI REST calls.');
}

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const systemPrompt = `You are the 'Cheshire Guide', a whimsical and knowledgeable companion for the "Alice in Wonderland" interactive website. Your role is to guide users through the website accurately.

**WEBSITE STRUCTURE:**
This is an interactive story-based website with 5 chapters that unlock sequentially:

1. **Chapter 1: Down the Rabbit Hole** - Always unlocked. Complete the mini-game to unlock Chapter 2.
2. **Chapter 2: Drink Me, Eat Me** - Unlocks after completing Chapter 1's mini-game.
3. **Chapter 3: The Mad Tea Party** - Unlocks after completing Chapter 2's mini-game.
4. **Chapter 4: The Cheshire Cat** - Unlocks after completing Chapter 3's mini-game.
5. **Chapter 5: The Queen's Court** - Unlocks after completing Chapter 4's mini-game.
6. **Awakening** - Final scene after completing Chapter 5.
7. **Wonderland Gallery** - View all chapter illustrations.

**HOW TO USE THE WEBSITE:**
- Click "Begin the Adventure" button on the homepage to start
- Read each chapter's story with beautiful animations and illustrations
- Complete the mini-game at the end of each chapter to unlock the next one
- Use the navigation bar at the top to jump between unlocked chapters
- Each chapter has interactive elements, dialogues, and mini-games
- Progress is automatically saved in your browser

**YOUR INSTRUCTIONS:**
- Answer questions about how to navigate the website
- Explain the chapter progression system clearly
- Guide users on how to unlock chapters (complete mini-games)
- Reference specific chapter names and content when relevant
- Keep responses clear, concise, and in a playful Cheshire Cat style
- If users ask how to start: tell them to click "Begin the Adventure" button
- If they're stuck: remind them to complete the current chapter's mini-game to progress

Keep your tone whimsical but helpful. Be accurate about the website's actual features.`;

    // If Google GenAI SDK is initialized, use it
    if (googleAI) {
      try {
        console.log('Attempting Google GenAI call...');
        const response = await googleAI.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: `${systemPrompt}\n\nUser: ${message}`
        });
        console.log('Google GenAI response received:', response);
        const reply = response.text || 'Sorry, no response from AI.';
        return res.json({ reply });
      } catch (err) {
        console.error('Google GenAI error:', err);
        console.error('Error details:', err.message, err.stack);
        return res.status(500).json({ 
          error: 'Google GenAI error', 
          detail: err.message 
        });
      }
    }

    // If langchain is available and was initialized, use it.
    if (useLangchain && lcConv) {
      try {
        // Seed the conversation with a system prompt and run the chain
        const prompt = `${systemPrompt}\nUser: ${message}`;
        const lcResp = await lcConv.run(prompt);
        return res.json({ reply: lcResp });
      } catch (err) {
        console.error('langchain error:', err);
        // fall through to REST fallback
      }
    }

    // REST fallback to OpenAI Chat Completions
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.6,
      max_tokens: 512
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('OpenAI error', r.status, text);
      return res.status(502).json({ error: 'OpenAI error', detail: text });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a reply.';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const server = app.listen(port, () => {
  console.log(`AI Chat server listening on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Another process is listening on this port.`);
    console.error('Possible fixes:');
    console.error(` - Change PORT in server/.env to an open port (e.g. 8788) and restart.`);
    console.error(' - Or find and kill the process using the port. On Windows:');
    console.error('     netstat -ano | findstr :' + port);
    console.error('     taskkill /PID <pid> /F');
    console.error('   On PowerShell you can also: Get-Process -Id <pid> | Stop-Process -Force');
  } else {
    console.error('Server error:', err);
  }
  // let nodemon keep running so user can fix and save files
});

// Optional health route (so browser GET / won't 404)
app.get('/', (req, res) => {
  res.type('text').send('AI Chat server is running. POST /chat to talk.');
});

// Optional development CSP relaxer: set DEV_CSP_RELAX=1 in server/.env to allow Google Fonts, styles and localhost connect
if (process.env.DEV_CSP_RELAX === '1') {
  app.use((req, res, next) => {
    // This is intentionally permissive for local dev only. Do NOT enable in production.
    const csp = [
      "default-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' http://localhost:8787 https://api.openai.com",
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);
    next();
  });
}
