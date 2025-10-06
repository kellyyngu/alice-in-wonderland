import { useState, useEffect } from "react";
import { DialogueBox } from "../DialogueBox";
import { MiniGame } from "../MiniGame";
import { CharacterImage } from "../CharacterImage";
import cheshireCatImg from "@/assets/cheshire-cat.png";
import aliceImg from "@/assets/alice.png";

interface Chapter4Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
}

export const Chapter4 = ({ isUnlocked = false, onComplete }: Chapter4Props) => {
  const [catVisible, setCatVisible] = useState(true);
  const [grinOnly, setGrinOnly] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!grinOnly) {
        setCatVisible((prev) => !prev);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [grinOnly]);

  const handleCatClick = () => {
    setGrinOnly(true);
    setTimeout(() => {
      setGrinOnly(false);
      setCatVisible(true);
    }, 4000);
  };

  const handleGameSuccess = () => {
    setGameComplete(true);
    setShowGame(false);
    onComplete?.();
    setTimeout(() => {
      const nextChapter = document.getElementById("chapter5");
      if (nextChapter) {
        nextChapter.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  };

  const handleGameFailure = () => {
    setShowGame(false);
  };

  if (showGame && !gameComplete) {
    return <MiniGame onSuccess={handleGameSuccess} onFailure={handleGameFailure} chapterNumber={4} />;
  }

  if (!isUnlocked) {
    return (
      <section
        id="chapter4"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 py-20 relative overflow-hidden"
      >
        <div className="text-center space-y-6">
          <div className="text-9xl mb-4">🔒</div>
          <h2 className="font-serif text-5xl text-foreground mb-4">Chapter 4: Locked</h2>
          <p className="text-xl text-muted-foreground">Complete Chapter 3's mini-game to unlock</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter4"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 py-20 relative overflow-hidden"
    >
      {/* Mysterious floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            😸
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-secondary/20 px-6 py-2 rounded-full mb-4">
            <span className="text-secondary font-bold text-sm tracking-wider">CHAPTER 4</span>
          </div>
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-foreground mb-8">
            The Cheshire Cat
          </h2>

          <div className="bg-secondary/10 backdrop-blur-sm rounded-2xl p-6 text-center text-foreground/80 text-lg italic animate-fade-in mb-8">
            Alice meets the mischievous Cheshire Cat who appears and disappears at will.
          </div>

          <div
            onClick={handleCatClick}
            className="cursor-pointer inline-block mb-12 relative"
          >
            {!grinOnly && (
              <div
                className={`transition-opacity duration-1000 ${
                  catVisible ? "animate-appear" : "animate-disappear"
                }`}
              >
                <CharacterImage
                  src={cheshireCatImg}
                  alt="Cheshire Cat"
                  isSpeaking={currentSpeaker === "Cheshire Cat"}
                />
              </div>
            )}
            {grinOnly && (
              <div className="text-9xl animate-grin">
                😁
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <DialogueBox
            speaker="Alice"
            text="Excuse me, could you tell me which way I ought to go from here?"
            delay={0}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />
          <DialogueBox
            speaker="Cheshire Cat"
            text="That depends on where you want to get to."
            delay={4000}
            characterImage={cheshireCatImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cheshire Cat")}
          />
          <DialogueBox 
            speaker="Alice" 
            text="I don't much care where…" 
            delay={7500}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />
          <DialogueBox
            speaker="Cheshire Cat"
            text="Then it doesn't matter which way you go."
            delay={10000}
            characterImage={cheshireCatImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cheshire Cat")}
          />
          <DialogueBox 
            speaker="Alice" 
            text="You're not very helpful." 
            delay={13500}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />
          <DialogueBox
            speaker="Cheshire Cat"
            text="Everyone's mad here. I'm mad. You're mad."
            delay={16000}
            characterImage={cheshireCatImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cheshire Cat")}
          />

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center text-muted-foreground italic animate-fade-in mt-12">
            (The cat's grin lingers after the rest fades away.)
            <div className="mt-4 text-sm">(Click the cat to see the grin effect!)</div>
          </div>

          {!gameComplete && (
            <div className="text-center pt-8">
              <button
                onClick={() => setShowGame(true)}
                className="bg-secondary text-secondary-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-secondary/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
              >
                😸 Solve the Cheshire's Riddle
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
