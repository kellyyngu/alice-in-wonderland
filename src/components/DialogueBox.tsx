import { useState, useRef } from "react";

import { CharacterImage } from "./CharacterImage";

interface DialogueBoxProps {
  speaker: string;
  text: string;
  delay?: number;
  characterImage?: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
  audioFile?: string;
}

export const DialogueBox = ({ speaker, text, delay = 0, characterImage, onSpeakingChange, audioFile }: DialogueBoxProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    // Stop the click from bubbling up to parent elements
    e.stopPropagation();

    // If audio file is provided, use it instead of text-to-speech
    if (audioFile) {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio instance
      const audio = new Audio(audioFile);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        onSpeakingChange?.(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      audio.onerror = () => {
        console.error(`Failed to load audio: ${audioFile}`);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      });
    } else {
      // Fallback to text-to-speech
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
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10 max-w-2xl mx-auto animate-fade-in cursor-pointer hover:bg-black/65 transition-all"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 mb-4 justify-start">
        {characterImage && (
          <CharacterImage src={characterImage} alt={speaker} className={`w-16 h-16 rounded-full border-2 border-primary mx-0 mr-4 flex-shrink-0`} isSpeaking={isSpeaking} />
        )}
        <div className="font-serif text-white font-bold text-xl">{speaker}</div>
      </div>
      <p className="text-white/90 text-lg leading-relaxed italic text-left">"{text}"</p>
      <p className="text-xs text-white/70 mt-2 text-left">Click to hear dialogue</p>
    </div>
  );
};
