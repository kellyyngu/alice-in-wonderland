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
  const [currentScene, setCurrentScene] = useState(0);
  const [clickMode, setClickMode] = useState(false); // Scroll mode is default
  
  const totalScenes = 8; // Total number of scenes in this chapter
  
  const nextScene = () => {
    if (currentScene < totalScenes - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

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

          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center gap-4">
            <button
              onClick={() => setClickMode(true)}
              className={`px-4 py-2 rounded-full transition-all ${
                clickMode 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              📖 Click Mode
            </button>
            <button
              onClick={() => setClickMode(false)}
              className={`px-4 py-2 rounded-full transition-all ${
                !clickMode 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              📜 Scroll Mode
            </button>
          </div>

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

        {clickMode ? (
          /* CLICK MODE: Single content area with fade transitions */
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            {/* Scene 0: Alice's question */}
            {currentScene === 0 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Alice"
                  text="Excuse me, could you tell me which way I ought to go from here?"
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 1: Alice meets Cheshire Cat image */}
            {currentScene === 1 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={aliceMeetsCheshireImg} alt="Alice meets the Cheshire Cat" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 2: Cheshire Cat responds */}
            {currentScene === 2 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Cheshire Cat"
                  text="That depends a good deal on where you want to get to."
                  delay={0}
                  characterImage={cheshireCatImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cheshire Cat")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 3: Cheshire Cat talking image */}
            {currentScene === 3 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={cheshireCatTalkingImg} alt="Cheshire Cat talking" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 4: Alice's response */}
            {currentScene === 4 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Alice"
                  text="I don't much care where—"
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 5: Cheshire Cat's wisdom */}
            {currentScene === 5 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Cheshire Cat"
                  text="Then it doesn't matter which way you go."
                  delay={0}
                  characterImage={cheshireCatImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cheshire Cat")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 6: Narration */}
            {currentScene === 6 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic">
                  <p>(The Cheshire Cat begins to fade, leaving only its grin behind...)</p>
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 7: Lingering grin image & mini-game */}
            {currentScene === 7 && (
              <div className="animate-fade-in w-full flex flex-col items-center space-y-6">
                <img src={cheshireLingeringImg} alt="Cheshire grin lingering" className="max-w-sm w-full md:w-auto rounded-2xl shadow-2xl" />
                {!gameComplete ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGame(true);
                    }}
                    className="bg-accent text-accent-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-accent/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
                  >
                    😺 Follow the Grin
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-2xl text-green-400 font-bold animate-bounce">✅ Chapter 4 Complete!</p>
                    <button
                      onClick={() => goTo?.(5)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all shadow-xl"
                    >
                      Continue to Chapter 5 →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* SCROLL MODE: Original stacked layout */
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
        )}
      </div>
    </section>
  );
};
