import { ArrowDown } from "lucide-react";
import wallpaper from "@/assets/wallpaper.png";
import chatbotIcon from "@/assets/chatbot-icon.png";
import { useState, useEffect, useRef } from "react";

// Simple markdown-to-JSX renderer for bold and lists
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
      const content = line.replace(/^[\s*-]+/, '').trim();
      const rendered = renderInline(content);
      elements.push(<li key={idx} className="ml-5 leading-relaxed">{rendered}</li>);
    } else if (line.trim()) {
      const rendered = renderInline(line);
      elements.push(<p key={idx} className="mb-2 leading-relaxed">{rendered}</p>);
    }
  });
  
  return <div>{elements}</div>;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface HeroProps {
  onBegin?: () => void;
}

export const Hero = ({ onBegin }: HeroProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Welcome to Wonderland! 🎩 I\'m your Cheshire Guide. What curious questions do you have?' }]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, chatOpen]);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((s) => [...s, { from: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
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

      let data;
      try {
        data = await resp.json();
      } catch (parseErr) {
        const txt = await resp.text().catch(() => '');
        throw new Error('Invalid JSON response from chat server: ' + (txt || parseErr.message));
      }

      setMessages((s) => [...s, { from: 'bot', text: data.reply || 'Sorry, no response.' }]);
    } catch (err: any) {
      console.error(err);
      setMessages((s) => [...s, { from: 'bot', text: `Chat error: ${err?.message || 'unknown'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToChapter1 = () => {
    const element = document.getElementById("chapter1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBegin = () => {
    if (onBegin) return onBegin();
    return scrollToChapter1();
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(6,6,12,0.55), rgba(10,6,20,0.25)), url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {["🕰️", "🎩", "🐇", "🌹", "🫖", "🃏"][i]}
          </div>
        ))}
      </div>

      <div className="text-center z-10 px-6">
        <h1 className="font-serif text-7xl md:text-9xl font-bold text-white mb-6 animate-scale-in drop-shadow-2xl">
          Alice in Wonderland
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 mb-12 animate-fade-in font-light" style={{ animationDelay: "200ms" }}>
          A Curious Interactive Journey
        </p>
        
        {/* Chat Button and Container */}
        <div className="mb-8 animate-fade-in flex items-center justify-center gap-0" style={{ animationDelay: "300ms" }}>
          {/* Chat Button - shifts left when open */}
          <div className={`flex flex-col items-center transition-all duration-500 ${chatOpen ? '-translate-x-16 -mr-4' : ''}`}>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="relative group"
              aria-label="Toggle chat"
            >
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse"></div>
              
              {/* Icon container */}
              <div className="relative w-60 h-60 transition-all duration-300 group-hover:scale-110">
                <img 
                  src={chatbotIcon} 
                  alt="Chat with Cheshire Guide" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{ 
                    animation: 'float 6s ease-in-out infinite, wiggle 4s ease-in-out infinite'
                  }}
                />
              </div>
            </button>
            
            {/* Badge centered below the button */}
            <div className="-mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap animate-bounce">
              💬 Chat with me!
            </div>
          </div>

          {/* Chatbot Panel - appears next to icon */}
          {chatOpen && (
            <div 
              className="w-[520px] h-[680px] rounded-2xl flex flex-col shadow-2xl border border-purple-300/50 animate-slide-in-right"
              style={{ 
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
              }}
            >
              <div className="bg-white/20 backdrop-blur-md px-6 py-5 flex justify-between items-center rounded-t-2xl border-b border-white/20">
                <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-lg">🎩 Cheshire Guide — Your Wonderland Companion</h3>
                <button 
                  className="bg-white/25 hover:bg-white/35 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all hover:rotate-90 text-2xl"
                  onClick={() => setChatOpen(false)} 
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-white/10 backdrop-blur-sm" ref={boxRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[320px] px-4 py-3 rounded-xl shadow-lg break-words overflow-wrap-anywhere text-left ${
                        m.from === 'bot' 
                          ? 'bg-white text-gray-800 rounded-bl-sm' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-sm'
                      }`}
                      style={{ wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                    >
                      {m.from === 'bot' ? renderMarkdown(m.text) : m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 bg-white/20 backdrop-blur-md flex gap-2 rounded-b-2xl border-t border-white/20">
                <input 
                  placeholder="Ask about the site" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && send()} 
                  className="flex-1 px-4 py-3 rounded-full border border-white/30 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all placeholder-gray-400"
                />
                <button 
                  onClick={send} 
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-bold hover:shadow-xl transition-all hover:-translate-y-0.5 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleBegin}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all hover:scale-105 shadow-lg border border-white/30 animate-fade-in flex items-center gap-2 mx-auto mb-16"
          style={{ animationDelay: "400ms" }}
        >
          Begin the Adventure
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
