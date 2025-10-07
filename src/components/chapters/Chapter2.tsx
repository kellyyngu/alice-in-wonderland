import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { MiniGame } from "../MiniGame";
import drinkMeImg from "@/assets/drink-me-bottle.png";
import aliceImg from "@/assets/alice.png";
import wallpaper from "@/assets/wallpaper.png";

interface Chapter2Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
  goTo?: (index: number) => void;
}

export const Chapter2 = ({ isUnlocked = false, onComplete, goTo }: Chapter2Props) => {
  const [aliceSize, setAliceSize] = useState<"normal" | "small" | "large">("normal");
  const [showGame, setShowGame] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  const handleGameSuccess = () => {
    setGameComplete(true);
    setShowGame(false);
    onComplete?.();
    setTimeout(() => {
      const nextChapter = document.getElementById("chapter3");
      if (nextChapter) {
        nextChapter.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  };

  const handleGameFailure = () => {
    setShowGame(false);
  };

  if (showGame && !gameComplete) {
    return <MiniGame onSuccess={handleGameSuccess} onFailure={handleGameFailure} chapterNumber={2} />;
  }

  if (!isUnlocked) {
    return (
      <section
        id="chapter2"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wonderland-cream to-muted py-20"
      >
        <div className="text-center space-y-6">
          <div className="text-9xl mb-4">🔒</div>
          <h2 className="font-serif text-5xl text-foreground mb-4">Chapter 2: Drink Me, Eat Me (Locked)</h2>
          <p className="text-xl text-muted-foreground">A tiny door, a table, a bottle and a cake. What could go wrong?</p>
          <p className="text-lg text-muted-foreground">Complete Chapter 1's mini-game to unlock</p>
          <div className="mt-6">
            <button
              onClick={() => goTo?.(1)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90"
            >
              Play Chapter 1 to Unlock
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter2"
      className="min-h-screen flex items-center justify-center py-20 with-wallpaper"
      style={{ ["--wallpaper-url" as any]: `url(${wallpaper})` }}
    >
      {/* Floating potions & cakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {([...Array(20)]).map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {i % 2 === 0 ? "🧪" : "🧁"}
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-black/50 px-6 py-2 rounded-full mb-4">
            <span className="text-white font-bold text-sm tracking-wider">CHAPTER 2</span>
          </div>
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-white mb-8">
            Drink Me, Eat Me
          </h2>

          <div className="mb-8">
            <img
              src={drinkMeImg}
              alt="Drink Me Bottle"
              className="max-w-sm mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 text-center text-white/90 text-lg italic animate-fade-in mb-8">
            Alice finds a table with a bottle labeled "Drink Me" and a cake labeled "Eat Me."
          </div>

          <DialogueBox 
            speaker="Alice" 
            text="A tiny door… and no key big enough for me." 
            delay={0}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />

          <DialogueBox 
            speaker="Bottle" 
            text="Drink me." 
            delay={3500}
            characterImage={drinkMeImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Bottle")}
          />

          <DialogueBox 
            speaker="Alice" 
            text="Oh? Talking bottles now? Well, why not!" 
            delay={5500}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />

          <div className="flex justify-center gap-8 my-12">
            <button
              onClick={() => {
                setAliceSize("small");
                // Play shrinking sound
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
              }}
              className="group relative"
            >
              <div className="bg-black/55 hover:bg-black/60 backdrop-blur-md rounded-2xl p-8 transition-all hover:scale-105 border border-white/10">
                <div className="text-6xl mb-3">🧪</div>
                <div className="font-serif text-xl font-bold text-white">Drink Me</div>
              </div>
            </button>

            <button
              onClick={() => {
                setAliceSize("large");
                // Play growing sound
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
              }}
              className="group relative"
            >
              <div className="bg-black/55 hover:bg-black/60 backdrop-blur-md rounded-2xl p-8 transition-all hover:scale-105 border border-white/10">
                <div className="text-6xl mb-3">🧁</div>
                <div className="font-serif text-xl font-bold text-white">Eat Me</div>
              </div>
            </button>
          </div>

          <div className="flex justify-center my-12">
            <div
              className={`transition-all duration-1000 ${
                aliceSize === "small"
                  ? "scale-50 animate-shrink"
                  : aliceSize === "large"
                  ? "scale-150 animate-grow"
                  : "scale-100"
              }`}
            >
              <div className="text-9xl">👧</div>
            </div>
          </div>

          {aliceSize === "small" && (
            <>
              <DialogueBox
                speaker="Alice"
                text="I'm smaller than a mouse! How curious this place is."
                delay={0}
                characterImage={aliceImg}
              />
              <DialogueBox 
                speaker="Cake" 
                text="Eat me." 
                delay={4000}
                characterImage={drinkMeImg}
                onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cake")}
              />
              <DialogueBox 
                speaker="Alice" 
                text="You again? Alright then!" 
                delay={6000}
                characterImage={aliceImg}
                onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
              />
            </>
          )}

          {aliceSize === "large" && (
            <DialogueBox
              speaker="Alice"
              text="Oh my! I'm growing like a telescope!"
              delay={0}
              characterImage={aliceImg}
            />
          )}

          {!gameComplete && aliceSize !== "normal" && (
            <div className="text-center pt-8">
              <button
                onClick={() => setShowGame(true)}
                className="bg-primary text-primary-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
              >
                🧪 Escape the Size Change Curse
              </button>
            </div>
          )}

          {gameComplete && (
            <div className="bg-accent/20 backdrop-blur-sm rounded-2xl p-6 text-foreground text-center animate-fade-in">
              <p className="text-xl font-semibold">✨ Chapter Complete! Scroll down to continue...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
