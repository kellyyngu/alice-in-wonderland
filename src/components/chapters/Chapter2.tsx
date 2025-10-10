import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { MiniGame } from "../MiniGame";
import drinkMeImg from "@/assets/drink-me-bottle.png";
import drinkEatImg from "@/assets/drink-eat-me.png";
import eatMeCake from "@/assets/eat-me-cake.png";
import aliceImg from "@/assets/alice.png";
import { CharacterImage } from "../CharacterImage";
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
  const [currentScene, setCurrentScene] = useState(0);
  const [clickMode, setClickMode] = useState(false); // Scroll mode is default
  
  const totalScenes = 7; // Total number of scenes in this chapter
  
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
      const nextChapter = document.getElementById("chapter3");
      if (nextChapter) nextChapter.scrollIntoView({ behavior: "smooth" });
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
        {[...Array(20)].map((_, i) => (
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

          <h2 className="font-serif text-6xl md:text-7xl font-bold text-white mb-8">Drink Me, Eat Me</h2>

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

          <div className="mb-8">
            <img src={drinkEatImg} alt="Drink & Eat" className="max-w-sm mx-auto drop-shadow-2xl" />
          </div>
        </div>

        {clickMode ? (
          /* CLICK MODE: Single content area with fade transitions */
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            {/* Scene 0: Bottle speaks */}
            {currentScene === 0 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Bottle"
                  text="Drink me."
                  delay={0}
                  characterImage={drinkMeImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Bottle")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 1: Drink me bottle image */}
            {currentScene === 1 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={drinkMeImg} alt="Drink me bottle" className="max-w-xs w-full md:w-auto rounded-2xl shadow-2xl" />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 2: Alice responds */}
            {currentScene === 2 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Alice"
                  text="Oh? Talking bottles now? Well, why not!"
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 3: Interactive drink/eat section */}
            {currentScene === 3 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-12">
                  <div
                    className={`transition-all duration-1000 flex-shrink-0 ${
                      aliceSize === "small" ? "animate-shrink" : aliceSize === "large" ? "animate-grow" : ""
                    }`}
                    style={{
                      transform: aliceSize === "small" ? "scale(0.5)" : aliceSize === "large" ? "scale(2.2)" : "scale(1)",
                    }}
                  >
                    <CharacterImage src={aliceImg} alt="Alice" className="w-28 md:w-40 animate-float" />
                  </div>

                  <div className="flex gap-8">
                    <div className="bg-black/55 hover:bg-black/60 backdrop-blur-md rounded-4xl p-8 transition-all hover:scale-105 border border-white/10 flex flex-col items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAliceSize("small");
                      }}
                    >
                      <img src={drinkMeImg} alt="Drink me bottle" className="w-20 h-20 mb-4 object-contain" />
                      <div className="font-serif text-2xl font-bold text-white">Drink Me</div>
                    </div>

                    <div className="bg-black/55 hover:bg-black/60 backdrop-blur-md rounded-4xl p-8 transition-all hover:scale-105 border border-white/10 flex flex-col items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAliceSize("large");
                      }}
                    >
                      <img src={eatMeCake} alt="Eat me cake" className="w-20 h-20 mb-4 object-contain" />
                      <div className="font-serif text-2xl font-bold text-white">Eat Me</div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  🍰 Try drinking or eating, then click to continue
                </div>
              </div>
            )}
            
            {/* Scene 4: Alice shrunk dialogue */}
            {currentScene === 4 && aliceSize === "small" && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Alice"
                  text="I'm smaller than a mouse! How curious this place is."
                  delay={0}
                  characterImage={aliceImg}
                />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 5: Cake speaks */}
            {currentScene === 5 && aliceSize === "small" && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Cake"
                  text="Eat me."
                  delay={0}
                  characterImage={eatMeCake}
                  onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Cake")}
                />
                <div className="flex justify-center mt-4">
                  <img src={eatMeCake} alt="Eat me cake" className="max-w-xs w-full md:w-auto rounded-2xl shadow-2xl" />
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 6: Alice grew dialogue */}
            {currentScene === 6 && aliceSize === "large" && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox speaker="Alice" text="Oh my! I'm growing like a telescope!" delay={0} characterImage={aliceImg} />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}
            
            {/* Scene 7: Mini-game or completion */}
            {(currentScene === 6 || (currentScene === 4 && aliceSize === "large")) && (
              <div className="animate-fade-in w-full flex flex-col items-center space-y-6">
                {!gameComplete && aliceSize !== "normal" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGame(true);
                    }}
                    className="bg-primary text-primary-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
                  >
                    🧪 Escape the Size Change Curse
                  </button>
                ) : gameComplete ? (
                  <div className="text-center space-y-4">
                    <p className="text-2xl text-green-400 font-bold animate-bounce">✅ Chapter 2 Complete!</p>
                    <button
                      onClick={() => goTo?.(3)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all shadow-xl"
                    >
                      Continue to Chapter 3 →
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          /* SCROLL MODE: Original stacked layout */
          <div className="space-y-6">

        <DialogueBox
          speaker="Bottle"
          text="Drink me."
          delay={3500}
          characterImage={drinkMeImg}
          onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Bottle")}
        />
        <div className="flex justify-center mt-4">
          <img src={drinkMeImg} alt="Drink me bottle" className="max-w-xs w-full md:w-auto rounded-2xl shadow-2xl" />
        </div>

        <DialogueBox
          speaker="Alice"
          text="Oh? Talking bottles now? Well, why not!"
          delay={5500}
          characterImage={aliceImg}
          onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
        />

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-12">
          {/* Alice (left on wide screens, above on small screens) */}
          <div
            className={`transition-all duration-1000 flex-shrink-0 ${
              aliceSize === "small" ? "animate-shrink" : aliceSize === "large" ? "animate-grow" : ""
            }`}
            style={{
              transform: aliceSize === "small" ? "scale(0.5)" : aliceSize === "large" ? "scale(2.2)" : "scale(1)",
            }}
          >
            <div className="mx-auto md:mx-0">
              <CharacterImage src={aliceImg} alt="Alice" className="w-28 md:w-40 animate-float" />
            </div>
          </div>

          <div className="flex gap-16">
            <div className="bg-black/55 hover:bg-black/60 backdrop-blur-md rounded-4xl p-16 transition-all hover:scale-105 border border-white/10 min-w-[320px] flex flex-col items-center">
              <img
                src={drinkMeImg}
                alt="Drink me bottle"
                className="w-28 h-28 mb-6 mx-auto object-contain cursor-pointer"
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
              />
              <div className="font-serif text-3xl font-bold text-white">Drink Me</div>
            </div>

            <div className="bg-black/55 hover:bg-black/60 backdrop-blur-md rounded-4xl p-16 transition-all hover:scale-105 border border-white/10 min-w-[320px] flex flex-col items-center">
              <img
                src={eatMeCake}
                alt="Eat me cake"
                className="w-28 h-28 mb-6 mx-auto object-contain cursor-pointer"
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
              />
              <div className="font-serif text-3xl font-bold text-white">Eat Me</div>
            </div>
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
            <div className="flex justify-center mt-4">
              <img src={eatMeCake} alt="Eat me cake" className="max-w-xs w-full md:w-auto rounded-2xl shadow-2xl" />
            </div>
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
          <DialogueBox speaker="Alice" text="Oh my! I'm growing like a telescope!" delay={0} characterImage={aliceImg} />
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
          <div className="bg-purple-900/70 text-white backdrop-blur-sm rounded-2xl p-6 text-center animate-fade-in">
            <p className="text-xl font-semibold">✨ Chapter Complete! Scroll down to continue...</p>
          </div>
        )}
          </div>
        )}
      </div>
    </section>
  );
};
