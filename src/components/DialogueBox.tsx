import { useState } from "react";

interface DialogueBoxProps {
  speaker: string;
  text: string;
  delay?: number;
  characterImage?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const DialogueBox = ({ speaker, text, delay = 0, characterImage, onSpeakingChange }: DialogueBoxProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleClick = () => {
    // Stop any ongoing speech first
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Use Web Speech API for free text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = speaker === "Alice" ? 1.2 : speaker === "White Rabbit" ? 1.3 : speaker === "Mad Hatter" ? 0.9 : 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        onSpeakingChange?.(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10 max-w-2xl mx-auto animate-fade-in cursor-pointer hover:bg-black/65 transition-all"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 mb-4">
        {characterImage && (
          <img 
            src={characterImage} 
            alt={speaker}
            className={`w-16 h-16 object-cover rounded-full border-2 border-primary transition-transform ${
              isSpeaking ? 'animate-shake' : ''
            }`}
          />
        )}
        <div className="font-serif text-white font-bold text-xl">{speaker}</div>
      </div>
      <p className="text-white/90 text-lg leading-relaxed italic">"{text}"</p>
      <p className="text-xs text-white/70 mt-2 text-center">Click to hear dialogue</p>
    </div>
  );
};
