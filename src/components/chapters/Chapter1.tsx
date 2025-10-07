import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { FallingObject } from "../FallingObject";
import { MiniGame } from "../MiniGame";
import { CharacterImage } from "../CharacterImage";
import whiteRabbitImg from "@/assets/white-rabbit.png";
import aliceImg from "@/assets/alice.png";
import wallpaper from "@/assets/wallpaper.png";

interface Chapter1Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
  goTo?: (index: number) => void;
}

export const Chapter1 = ({ isUnlocked = true, onComplete, goTo }: Chapter1Props) => {
  const [showGame, setShowGame] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  const handleGameSuccess = () => {
    setGameComplete(true);
    setShowGame(false);
    onComplete?.();
    setTimeout(() => {
      const nextChapter = document.getElementById("chapter2");
      if (nextChapter) {
        nextChapter.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  };

  const handleGameFailure = () => {
    setShowGame(false);
  };

  if (showGame && !gameComplete) {
    return <MiniGame onSuccess={handleGameSuccess} onFailure={handleGameFailure} chapterNumber={1} />;
  }

  if (!isUnlocked) {
    return (
      <section
        id="chapter1"
        className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-rabbit-hole py-20"
      >
        <div className="text-center space-y-6">
          <div className="text-9xl mb-4">🔒</div>
          <h2 className="font-serif text-5xl text-white mb-4">Chapter 1: Locked</h2>
          <p className="text-xl text-white/70">Complete the previous chapter's mini-game to unlock</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter1"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-rabbit-hole py-20 with-wallpaper"
      style={{
        // set wallpaper via CSS variable so the ::before pseudo-element can blur it
        ["--wallpaper-url" as any]: `url(${wallpaper})`,
      }}
    >
      {/* Falling objects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <FallingObject
            key={i}
            icon={["🕰️", "📚", "🫖", "🎩", "🔑"][i % 5]}
            delay={i * 0.5}
            duration={8 + Math.random() * 4}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-black/50 px-6 py-2 rounded-full mb-4">
            <span className="text-white font-bold text-sm tracking-wider">CHAPTER 1</span>
          </div>
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-white mb-8">
            Down the Rabbit Hole
          </h2>
          
          <div className="mb-8">
            <CharacterImage
              src={whiteRabbitImg}
              alt="White Rabbit"
              isSpeaking={currentSpeaker === "White Rabbit"}
            />
          </div>

          <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 text-center text-white/90 text-lg italic animate-fade-in mb-8">
            Alice sees the White Rabbit rushing by and decides to follow him, leading her to fall down a rabbit hole.
          </div>
        </div>

        <div className="space-y-6">
          <DialogueBox 
            speaker="Alice" 
            text="What a peculiar rabbit... wearing a coat and holding a watch?" 
            delay={0}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />
          <DialogueBox 
            speaker="White Rabbit" 
            text="Oh dear! Oh dear! I shall be late!" 
            delay={3500}
            characterImage={whiteRabbitImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("White Rabbit")}
          />
          <DialogueBox 
            speaker="Alice" 
            text="Late for what? Wait! Come back!" 
            delay={6500}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />
          
          <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-6 text-white/90 text-center text-lg italic animate-fade-in" style={{ animationDelay: "9000ms" }}>
            <p className="mb-2">(White Rabbit runs off. Alice follows.)</p>
          </div>

          <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-8 text-white/90 text-center text-xl italic animate-fade-in" style={{ animationDelay: "9500ms" }}>
            Without a second thought, curiosity pulled her in…
          </div>

          <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-6 text-white/90 text-center text-lg italic animate-fade-in" style={{ animationDelay: "10000ms" }}>
            <p>(Alice falls down — the world spins slowly around her…)</p>
          </div>

          {!gameComplete ? (
            <div className="text-center pt-8">
              <button
                onClick={() => setShowGame(true)}
                className="bg-accent text-accent-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-accent/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
              >
                🕳️ Fall Down the Rabbit Hole
              </button>
            </div>
          ) : (
            <div className="bg-accent/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center animate-fade-in">
              <p className="text-xl font-semibold">✨ Chapter Complete! Scroll down to continue...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
