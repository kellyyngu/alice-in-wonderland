import { useState, useEffect } from "react";
import { DialogueBox } from "../DialogueBox";
import { MiniGame } from "../MiniGame";
import { CharacterImage } from "../CharacterImage";
import cheshireCatImg from "@/assets/cheshire-cat.png";
import aliceImg from "@/assets/alice.png";
import aliceMeetsCheshireImg from "@/assets/alice-meets-cheshire-cat.png";
import cheshireCatTalkingImg from "@/assets/cheshire-cat-talking.png";
import cheshireLingeringImg from "@/assets/cheshire-lingering.png";
import wallpaper from "@/assets/wallpaper.png";

interface Chapter4Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
  goTo?: (index: number) => void;
}

export const Chapter4 = ({ isUnlocked = false, onComplete, goTo }: Chapter4Props) => {
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
          <h2 className="font-serif text-5xl text-foreground mb-4">Chapter 4: The Cheshire Cat (Locked)</h2>
          <p className="text-xl text-muted-foreground">A grin in the trees and riddles that bend the mind.</p>
          <p className="text-lg text-muted-foreground">Complete Chapter 3's mini-game to unlock</p>
          <div className="mt-6">
            <button
              onClick={() => goTo?.(3)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90"
            >
              Play Chapter 3 to Unlock
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter4"
      className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden with-wallpaper"
      style={{ ["--wallpaper-url" as any]: `url(${wallpaper})` }}
    >

      <div className="max-w-4xl mx-auto px-6 z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-black/50 px-6 py-2 rounded-full mb-4">
            <span className="text-white font-bold text-sm tracking-wider">CHAPTER 4</span>
          </div>
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-white mb-8">
            The Cheshire Cat
          </h2>

          <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic animate-fade-in mb-8">
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
                  className="animate-float"
                />
              </div>
            )}
            {grinOnly && (
              <div className="animate-grin">
                <img src={cheshireLingeringImg} alt="Cheshire grin" className="w-64 h-64 md:w-96 md:h-96 object-contain" />
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
          {/* Image: Alice meets the Cheshire Cat (placed immediately after Alice's question) */}
          <div className="flex justify-center mt-4">
            <img src={aliceMeetsCheshireImg} alt="Alice meets the Cheshire Cat" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
          </div>
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
          <div className="flex justify-center mt-4">
            <img src={cheshireCatTalkingImg} alt="Cheshire Cat talking" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
          </div>
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

          <div className="bg-purple-900/70 text-white backdrop-blur-md rounded-2xl p-6 text-center italic animate-fade-in mt-12">
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
            <div className="bg-purple-900/70 text-white backdrop-blur-md rounded-2xl p-6 text-center animate-fade-in">
              <p className="text-xl font-semibold">✨ Chapter Complete! Scroll down to continue...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
