import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { CharacterImage } from "../CharacterImage";
import queenOfHeartsImg from "@/assets/queen-of-hearts.png";
import kingOfHeartsImg from "@/assets/king-of-hearts.png";
import aliceImg from "@/assets/alice.png";
import wallpaper from "@/assets/wallpaper.png";

const suits = ["♥️", "♦️", "♣️", "♠️"];

interface Chapter5Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
  goTo?: (index: number) => void;
}

export const Chapter5 = ({ isUnlocked = false, onComplete, goTo }: Chapter5Props) => {
  const [exploded, setExploded] = useState(false);
  const [awakened, setAwakened] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  const handleExplosion = () => {
    setExploded(true);
    // After the explosion sequence, wake Alice and mark chapter as complete (no mini-game)
    setTimeout(() => {
      setAwakened(true);
      onComplete?.();
    }, 2000);
  };


  if (!isUnlocked) {
    return (
      <section
        id="chapter5"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-rose-100 to-pink-100 py-20 relative overflow-hidden"
      >
        <div className="text-center space-y-6">
          <div className="text-9xl mb-4">🔒</div>
          <h2 className="font-serif text-5xl text-foreground mb-4">Chapter 5: The Queen's Court (Locked)</h2>
          <p className="text-xl text-muted-foreground">Chaos in the garden and a court unlike any other.</p>
          <p className="text-lg text-muted-foreground">Complete Chapter 4's mini-game to unlock</p>
          <div className="mt-6">
            <button
              onClick={() => goTo?.(4)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90"
            >
              Play Chapter 4 to Unlock
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter5"
      className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden with-wallpaper"
      style={{ ["--wallpaper-url" as any]: `url(${wallpaper})` }}
    >
      {/* Floating roses */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            🌹
          </div>
        ))}
      </div>

      {/* Card explosion effect */}
      {exploded && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-card-explosion"
              style={{
                left: "50%",
                top: "50%",
                // @ts-ignore
                "--tx": `${(Math.random() - 0.5) * 200}vw`,
                "--ty": `${(Math.random() - 0.5) * 200}vh`,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {suits[i % suits.length]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 z-10">
        {!awakened ? (
          <>
            <div className="text-center mb-12">
              <div className="inline-block bg-black/50 px-6 py-2 rounded-full mb-4">
                <span className="text-white font-bold text-sm tracking-wider">CHAPTER 5</span>
              </div>
              <h2 className="font-serif text-6xl md:text-7xl font-bold text-white mb-8">
                The Queen's Court
              </h2>
              
              <div className="flex justify-center gap-8 mb-8">
                <CharacterImage
                  src={queenOfHeartsImg}
                  alt="Queen of Hearts"
                  isSpeaking={currentSpeaker === "Queen of Hearts"}
                  className="max-w-[200px]"
                />
                <CharacterImage
                  src={kingOfHeartsImg}
                  alt="King of Hearts"
                  isSpeaking={currentSpeaker === "King"}
                  className="max-w-[200px]"
                />
              </div>

              <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 text-center text-white/90 text-lg italic animate-fade-in mb-8">
                Alice enters the Queen of Hearts' garden, where chaos reigns.
              </div>
            </div>

            <div className="space-y-6">
              <DialogueBox
                speaker="Queen of Hearts"
                text="Who painted my roses red? Off with their heads!"
                delay={0}
                characterImage={queenOfHeartsImg}
                onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Queen of Hearts")}
              />
              <DialogueBox
                speaker="Alice"
                text="You can't just go around cutting off heads!"
                delay={4000}
                characterImage={aliceImg}
                onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
              />
              <DialogueBox 
                speaker="King" 
                text="My dear, perhaps a trial first?" 
                delay={7500}
                characterImage={kingOfHeartsImg}
                onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("King")}
              />
              <DialogueBox
                speaker="Queen of Hearts"
                text="Sentence first! Verdict afterward!"
                delay={10000}
                characterImage={queenOfHeartsImg}
                onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Queen of Hearts")}
              />

              {!exploded && (
                <div className="text-center pt-8">
                  <button
                    onClick={handleExplosion}
                    className="bg-destructive text-destructive-foreground px-12 py-4 rounded-full text-xl font-bold hover:bg-destructive/90 transition-all hover:scale-105 shadow-lg animate-pulse"
                  >
                    "You're nothing but a pack of cards!"
                  </button>
                </div>
              )}

                      {exploded && (
                        <div className="bg-destructive/20 backdrop-blur-sm rounded-2xl p-6 text-center text-foreground/80 text-lg italic animate-fade-in mt-8">
                          <p>(Cards swirl, screen shakes — transition to waking up.)</p>
                          <div className="mt-6 flex justify-center gap-4">
                            <button
                              onClick={() => {
                                const gallery = document.getElementById("wonderland-gallery");
                                if (gallery) {
                                  gallery.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-bold hover:bg-accent/90 transition-all hover:scale-105"
                            >
                              Enter Wonderland Gallery ✨
                            </button>
                          </div>
                        </div>
                      )}
            </div>
          </>
        ) : (
          // Awakening moved to a dedicated page shown after Chapter 5 completes.
          <div className="text-center animate-fade-in">
            <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
              <div className="text-7xl mb-6">☀️</div>
              <h3 className="font-serif text-5xl font-bold text-foreground mb-6">
                A Curious Dream
              </h3>
              <p className="text-2xl text-muted-foreground italic leading-relaxed mb-8">
                And with that, Alice awoke, as if from a very curious dream...
              </p>
              <div className="text-6xl mb-8 animate-float">👧</div>

              <div className="mt-6">
                <button
                  onClick={() => onComplete?.()}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
