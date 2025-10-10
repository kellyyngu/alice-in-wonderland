import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { FallingObject } from "../FallingObject";
import { MiniGame } from "../MiniGame";
import { CharacterImage } from "../CharacterImage";
import whiteRabbitImg from "@/assets/white-rabbit.png";
import aliceImg from "@/assets/alice.png";
import aliceFollowsImg from "@/assets/alice-follows-white-rabbit.png";
import aliceFallsImg from "@/assets/alice-falls-down.png";
import aliceSeesWhiteRabbitImg from "@/assets/alice-sees-white-rabbit.png";
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
  const [currentScene, setCurrentScene] = useState(0);
  const [clickMode, setClickMode] = useState(false); // Scroll mode is default
  
  const totalScenes = 9; // Total number of scenes in this chapter
  
  const nextScene = () => {
    if (currentScene < totalScenes - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

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
              📖 Story Mode
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

          <div className="mb-8 flex justify-center">
            <CharacterImage
              src={whiteRabbitImg}
              alt="White Rabbit"
              isSpeaking={currentSpeaker === "White Rabbit"}
              className="animate-float"
            />
          </div>

          <div className="bg-purple-900/70 text-white backdrop-blur-md rounded-2xl p-6 text-center text-lg italic animate-fade-in mb-8">
            Alice sees the White Rabbit rushing by and decides to follow him, leading her to fall down a rabbit hole.
          </div>
        </div>

        {clickMode ? (
          /* CLICK MODE: Single content area with fade transitions */
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            {/* Scene 0: Alice's first line */}
            {currentScene === 0 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox 
                  speaker="Alice" 
                  text="What a peculiar rabbit... wearing a coat and holding a watch?" 
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 1: Alice sees White Rabbit image */}
            {currentScene === 1 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={aliceSeesWhiteRabbitImg} alt="Alice sees White Rabbit" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 2: White Rabbit speaks */}
            {currentScene === 2 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox 
                  speaker="White Rabbit" 
                  text="Oh dear! Oh dear! I shall be late!" 
                  delay={0}
                  characterImage={whiteRabbitImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("White Rabbit")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 3: Alice responds */}
            {currentScene === 3 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox 
                  speaker="Alice" 
                  text="Late for what? Wait! Come back!" 
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 4: Narration - White Rabbit runs off */}
            {currentScene === 4 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic">
                  <p className="mb-2">(White Rabbit runs off. Alice follows.)</p>
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 5: Alice follows image */}
            {currentScene === 5 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={aliceFollowsImg} alt="Alice follows the White Rabbit" className="max-w-sm w-full md:w-auto rounded-2xl shadow-2xl" />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}

            {/* Scene 6: Curiosity narration */}
            {currentScene === 6 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-8 text-center text-xl italic">
                  Without a second thought, curiosity pulled her in…
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}

            {/* Scene 7: Alice falls narration */}
            {currentScene === 7 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic">
                  <p>(Alice falls down — the world spins slowly around her…)</p>
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}

            {/* Scene 8: Alice falls image & mini-game button */}
            {currentScene === 8 && (
              <div className="animate-fade-in w-full flex flex-col items-center space-y-6">
                <img src={aliceFallsImg} alt="Alice falls down the rabbit hole" className="max-w-sm w-full md:w-auto rounded-2xl shadow-2xl" />
                {!gameComplete ? (
                  <button
                    onClick={() => setShowGame(true)}
                    className="bg-accent text-accent-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-accent/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
                  >
                    🕳️ Fall Down the Rabbit Hole
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-2xl text-green-400 font-bold animate-bounce">✅ Chapter 1 Complete!</p>
                    <button
                      onClick={() => goTo?.(2)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all shadow-xl"
                    >
                      Continue to Chapter 2 →
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
              text="What a peculiar rabbit... wearing a coat and holding a watch?" 
              delay={0}
              characterImage={aliceImg}
              onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
            />
            <div className="flex justify-center mt-4">
              <img src={aliceSeesWhiteRabbitImg} alt="Alice sees White Rabbit" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
            </div>
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
            
            <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic animate-fade-in" style={{ animationDelay: "9000ms" }}>
              <p className="mb-2">(White Rabbit runs off. Alice follows.)</p>
            </div>
            <div className="flex justify-center mt-4">
              <img src={aliceFollowsImg} alt="Alice follows the White Rabbit" className="max-w-sm w-full md:w-auto rounded-2xl shadow-2xl" />
            </div>

            <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-8 text-center text-xl italic animate-fade-in" style={{ animationDelay: "9500ms" }}>
              Without a second thought, curiosity pulled her in…
            </div>

            <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic animate-fade-in" style={{ animationDelay: "10000ms" }}>
              <p>(Alice falls down — the world spins slowly around her…)</p>
            </div>

            <div className="flex justify-center mt-4">
              <img src={aliceFallsImg} alt="Alice falls down the rabbit hole" className="max-w-sm w-full md:w-auto rounded-2xl shadow-2xl" />
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
        )}
      </div>
    </section>
  );
};
