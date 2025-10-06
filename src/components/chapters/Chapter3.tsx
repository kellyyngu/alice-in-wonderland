import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { MiniGame } from "../MiniGame";
import { CharacterImage } from "../CharacterImage";
import madHatterImg from "@/assets/mad-hatter.png";
import marchHareImg from "@/assets/march-hare.png";
import aliceImg from "@/assets/alice.png";

interface Chapter3Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
}

export const Chapter3 = ({ isUnlocked = false, onComplete }: Chapter3Props) => {
  const [teaCups, setTeaCups] = useState([
    { id: 1, position: 0 },
    { id: 2, position: 1 },
    { id: 3, position: 2 },
  ]);
  const [showGame, setShowGame] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  const shuffleCups = () => {
    setTeaCups((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.map((cup, index) => ({ ...cup, position: index }));
    });
  };

  const handleGameSuccess = () => {
    setGameComplete(true);
    setShowGame(false);
    onComplete?.();
    setTimeout(() => {
      const nextChapter = document.getElementById("chapter4");
      if (nextChapter) {
        nextChapter.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  };

  const handleGameFailure = () => {
    setShowGame(false);
  };

  if (showGame && !gameComplete) {
    return <MiniGame onSuccess={handleGameSuccess} onFailure={handleGameFailure} chapterNumber={3} />;
  }

  if (!isUnlocked) {
    return (
      <section
        id="chapter3"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-20"
      >
        <div className="text-center space-y-6">
          <div className="text-9xl mb-4">🔒</div>
          <h2 className="font-serif text-5xl text-foreground mb-4">Chapter 3: Locked</h2>
          <p className="text-xl text-muted-foreground">Complete Chapter 2's mini-game to unlock</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter3"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-20"
    >
      {/* Floating tea & teapot emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {([...Array(20)]).map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.12}s`,
            }}
          >
            {i % 2 === 0 ? "🫖" : "🍵"}
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 px-6 py-2 rounded-full mb-4">
            <span className="text-primary font-bold text-sm tracking-wider">CHAPTER 3</span>
          </div>
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-foreground mb-8">
            The Mad Tea Party
          </h2>

          <div className="flex justify-center gap-8 mb-8">
            <CharacterImage
              src={madHatterImg}
              alt="Mad Hatter"
              isSpeaking={currentSpeaker === "Mad Hatter"}
              className="max-w-[200px]"
            />
            <CharacterImage
              src={marchHareImg}
              alt="March Hare"
              isSpeaking={currentSpeaker === "March Hare"}
              className="max-w-[200px]"
            />
          </div>

          <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-6 text-center text-foreground/80 text-lg italic animate-fade-in mb-8">
            Alice joins the Mad Hatter, March Hare, and Dormouse at a chaotic tea party.
          </div>
        </div>

        <div className="space-y-6">
          <DialogueBox 
            speaker="Mad Hatter" 
            text="No room! No room!" 
            delay={0}
            characterImage={madHatterImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Mad Hatter")}
          />
          <DialogueBox 
            speaker="Alice" 
            text="But there's plenty of space!" 
            delay={2500}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />
          <DialogueBox 
            speaker="March Hare" 
            text="Have some tea — or don't. It's always tea time anyway!" 
            delay={5000}
            characterImage={marchHareImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("March Hare")}
          />
          <DialogueBox 
            speaker="Alice" 
            text="Always? When do you have lunch?" 
            delay={9500}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />

          <div className="bg-card rounded-3xl p-8 shadow-xl my-12">
            <div className="flex justify-center gap-8 mb-6">
              {teaCups.map((cup) => (
                <div
                  key={cup.id}
                  className="text-7xl transition-all duration-500 transform hover:scale-110 hover:-rotate-12 cursor-pointer"
                  style={{
                    transform: `translateX(${(cup.position - 1) * 100}%)`,
                  }}
                >
                  🫖
                </div>
              ))}
            </div>
            <button
              onClick={shuffleCups}
              className="mx-auto block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Shuffle the Tea Cups!
            </button>
          </div>


          <DialogueBox 
            speaker="Mad Hatter" 
            text="When Time behaves himself, which he never does." 
            delay={11500}
            characterImage={madHatterImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Mad Hatter")}
          />

          <div className="text-center my-6">
            <div className="inline-flex items-center gap-3 bg-muted/50 rounded-2xl px-6 py-4">
              <span className="text-5xl">😴</span>
              <span className="text-muted-foreground italic">(Dormouse falls asleep mid-sentence.)</span>
            </div>
          </div>

          <DialogueBox 
            speaker="Alice" 
            text="I think I'll have my tea elsewhere…" 
            delay={14000}
            characterImage={aliceImg}
            onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
          />

          {!gameComplete && (
            <div className="text-center pt-8">
              <button
                onClick={() => setShowGame(true)}
                className="bg-primary text-primary-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
              >
                🍵 Escape the Endless Tea Party
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
