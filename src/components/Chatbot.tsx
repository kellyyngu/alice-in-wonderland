import { useState, useEffect, useRef } from 'react';

import './chatbot.css';

// Simple markdown-to-JSX renderer for bold and lists
function renderMarkdown(text: string) {
  // Split by lines for list processing
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  
  lines.forEach((line, idx) => {
    // Handle bullet lists
    if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
      const content = line.replace(/^[\s*-]+/, '').trim();
      const rendered = renderInline(content);
      elements.push(<li key={idx} className="chat-list-item">{rendered}</li>);
    } else if (line.trim()) {
      // Regular paragraph with inline bold
      const rendered = renderInline(line);
      elements.push(<p key={idx} className="chat-paragraph">{rendered}</p>);
    }
  });
  
  return <div className="chat-markdown">{elements}</div>;
}

function renderInline(text: string) {
  // Split by bold markers **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi — I am AliceBot. Ask me about this interactive site.' }]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((s) => [...s, { from: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      // default to the local dev server if VITE_CHAT_ENDPOINT isn't set
      const base = import.meta.env.VITE_CHAT_ENDPOINT || 'http://localhost:8787';
      const resp = await fetch(base.replace(/\/$/, '') + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error(`Server returned ${resp.status}: ${txt || resp.statusText}`);
      }

      // Try to parse JSON, but handle empty/non-json responses
      let data;
      try {
        data = await resp.json();
      } catch (parseErr) {
        const txt = await resp.text().catch(() => '');
        throw new Error('Invalid JSON response from chat server: ' + (txt || parseErr.message));
      }

      setMessages((s) => [...s, { from: 'bot', text: data.reply || 'Sorry, no response.' }]);
    } catch (err) {
      console.error(err);
      setMessages((s) => [...s, { from: 'bot', text: `Chat error: ${err?.message || 'unknown'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle chat">
        💬
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog">
          <div className="chat-header">
            <h3>AliceBot — Interactive Guide</h3>
            <button 
              className="close-btn" 
              onClick={() => setOpen(false)} 
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="chat-body" ref={boxRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <div className="bubble">
                  {m.from === 'bot' ? renderMarkdown(m.text) : m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input 
              placeholder="Ask about the site" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && send()} 
            />
            <button onClick={send} disabled={loading}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
