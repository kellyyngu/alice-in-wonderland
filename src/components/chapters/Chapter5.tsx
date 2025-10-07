import { useState, useRef, useEffect } from "react";
import { DialogueBox } from "../DialogueBox";
import { CharacterImage } from "../CharacterImage";
import queenOfHeartsImg from "@/assets/queen-of-hearts.png";
import kingOfHeartsImg from "@/assets/king-of-hearts.png";
import aliceImg from "@/assets/alice.png";
import qohGardenImg from "@/assets/qoh-garden.png";
import aliceDefianceImg from "@/assets/alice-defiance.png";
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
  const [shaking, setShaking] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [buttonCoords, setButtonCoords] = useState<{ left: string; top: string } | null>(null);
  const [flash, setFlash] = useState(false);

  const handleExplosion = () => {
    // capture button position for localized explosions
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // center point of the button in viewport pixels
      setButtonCoords({ left: `${rect.left + rect.width / 2}px`, top: `${rect.top + rect.height / 2}px` });
    }

    // trigger a quick screen shake
    setShaking(true);
    setTimeout(() => setShaking(false), 1400);

    // quick white flash to emphasize impact
    setFlash(true);
    setTimeout(() => setFlash(false), 220);

    // do not change the user's scroll position — the explosion overlay is fixed and will cover the viewport
    setExploded(true);

    // match the card animation length (6s) plus a small buffer
    setTimeout(() => {
      setAwakened(true);
      onComplete?.();
    }, 7000);
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
      className={`min-h-screen flex items-center justify-center py-20 relative overflow-hidden with-wallpaper ${shaking ? "animate-shake" : ""}`}
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
        {/* Full-screen fixed explosion overlay so it's visible regardless of scroll */}
        {exploded && (
          <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
            {/* subtle white flash */}
            {flash && <div className="absolute inset-0 bg-white/90 z-[80]" />}
            {[...Array(220)].map((_, i) => {
              const sizeClass = i % 5 === 0 ? "text-9xl" : i % 3 === 0 ? "text-8xl" : "text-7xl";
              const left = `${Math.random() * 100}%`;
              const top = `${Math.random() * 100}%`;
              const tx = `${(Math.random() - 0.5) * 500}vw`;
              const ty = `${(Math.random() - 0.5) * 500}vh`;
              const delay = `${Math.random() * 2.2}s`;
              // color hearts red, others black for dramatic effect
              const suit = suits[Math.floor(Math.random() * suits.length)];
              const colorStyle = suit === "♥️" ? { color: "#ff4d6d" } : { color: "#111" };
              return (
                <div
                  key={i}
                  className={`absolute ${sizeClass} animate-card-explosion`} 
                  style={{
                    left,
                    top,
                    // @ts-ignore
                    "--tx": tx,
                    // @ts-ignore
                    "--ty": ty,
                    animationDelay: delay,
                    opacity: 0.98,
                    ...colorStyle,
                  }}
                >
                  {suit}
                </div>
              );
            })}
          </div>
        )}

      {/* Localized explosions beside the button (two clusters) */}
      {exploded && buttonCoords && (
        <>
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              // use fixed so coordinates are viewport-based and align exactly with the button
              className="fixed pointer-events-none"
              style={{
                left: buttonCoords.left,
                top: buttonCoords.top,
                transform:
                  n === 0
                    ? `translate(-50%, -50%) translate(-6rem, -2rem)` // left cluster
                    : n === 1
                    ? `translate(-50%, -120%)` // above cluster
                    : `translate(-50%, -50%) translate(6rem, 2rem)`, // right cluster
                width: "0",
                height: "0",
                zIndex: 60,
              }}
            >
              {/* each cluster spawns a small burst biased toward hearts/spades */}
              {[...Array(18)].map((_, i) => {
                const sizeClass = i % 4 === 0 ? "text-5xl" : "text-4xl";
                const tx = `${(Math.random() - 0.5) * 80}vw`;
                const ty = `${(Math.random() - 0.5) * 80}vh`;
                const delay = `${Math.random() * 0.6}s`;
                const localSuits = ["♥️", "♠️", "♥️", "♠️", "♦️", "♣️"];
                const suit = localSuits[Math.floor(Math.random() * localSuits.length)];
                return (
                  <div
                    key={i}
                    className={`absolute ${sizeClass} animate-card-explosion`} 
                    style={{
                      left: 0,
                      top: 0,
                      // @ts-ignore
                      "--tx": tx,
                      // @ts-ignore
                      "--ty": ty,
                      animationDelay: delay,
                      opacity: 0.98,
                    }}
                  >
                    {suit}
                  </div>
                );
              })}
            </div>
          ))}
        </>
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
                    className="max-w-[200px] animate-float"
                />
                <CharacterImage
                  src={kingOfHeartsImg}
                  alt="King of Hearts"
                  isSpeaking={currentSpeaker === "King"}
                    className="max-w-[200px] animate-float"
                />
              </div>

              <div className="bg-purple-900/70 text-white backdrop-blur-md rounded-2xl p-6 text-center text-lg italic animate-fade-in mb-8">
                    Alice enters the Queen of Hearts' garden, where chaos reigns.
                  </div>

                  <div className="flex justify-center mt-4">
                    <img src={qohGardenImg} alt="Queen of Hearts Garden" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
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
              {/* Image: Alice defiant reaction - placed after Alice's protest */}
              <div className="flex justify-center mt-4">
                <img src={aliceDefianceImg} alt="Alice defiant" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
              </div>
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
                        ref={buttonRef}
                        onClick={handleExplosion}
                        className="bg-destructive text-destructive-foreground px-12 py-4 rounded-full text-xl font-bold hover:bg-destructive/90 transition-all hover:scale-105 shadow-lg animate-pulse"
                  >
                    "You're nothing but a pack of cards!"
                  </button>
                </div>
              )}

                      {exploded && (
                        <div className="bg-purple-900/70 text-white/90 backdrop-blur-sm rounded-2xl p-6 text-center text-lg italic animate-fade-in mt-8">
                          <p>(Cards swirl, screen shakes — transition to waking up.)</p>
                              {/* Gallery entry removed per design; user returns to awakening flow */}
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
              <div className="mb-8 animate-float">
                <CharacterImage src={aliceImg} alt="Alice" className="mx-auto w-20" />
              </div>

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
