import { useState } from "react";
import { DialogueBox } from "../DialogueBox";
import { MiniGame } from "../MiniGame";
import { CharacterImage } from "../CharacterImage";
import madHatterImg from "@/assets/mad-hatter.png";
import madHatterNoRoomImg from "@/assets/madhatter-noroom.png";
import marchHareImg from "@/assets/march-hare.png";
import aliceImg from "@/assets/alice.png";
import teaPartyImg from "@/assets/the-mad-tea-party.png";
import dormouseAsleepImg from "@/assets/dormouse-asleep.png";
import wallpaper from "@/assets/wallpaper.png";

// Voice lines
import c3_no_room from "@/assets/voices/c3/c3_no_room.mp3";
import c3_plenty_of_space from "@/assets/voices/c3/c3_plenty_of_space.m4a";
import c3_have_some_tea from "@/assets/voices/c3/c3_have_some_tea.mp3";
import c3_tea_elsewhere from "@/assets/voices/c3/c3_tea_elsewhere.m4a";
import c3_time_behaves from "@/assets/voices/c3/c3_time_behaves.mp3";
import c3_lunch from "@/assets/voices/c3/c3_lunch.m4a";

interface Chapter3Props {
  isUnlocked?: boolean;
  onComplete?: () => void;
  goTo?: (index: number) => void;
}

export const Chapter3 = ({ isUnlocked = false, onComplete, goTo }: Chapter3Props) => {
  const [teaCups, setTeaCups] = useState([
    { id: 1, position: 0 },
    { id: 2, position: 1 },
    { id: 3, position: 2 },
  ]);
  const [showGame, setShowGame] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [clickMode, setClickMode] = useState(false); // Scroll mode is default
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Track if audio is playing

  const totalScenes = 10; // Total number of scenes in this chapter

  const nextScene = () => {
    // Don't advance if audio is playing in click mode
    if (clickMode && isAudioPlaying) {
      return;
    }
    if (currentScene < totalScenes - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  const handleSpeakingChange = (speaking: boolean) => {
    setIsAudioPlaying(speaking);
  };

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
          <h2 className="font-serif text-5xl text-foreground mb-4">Chapter 3: The Mad Tea Party (Locked)</h2>
          <p className="text-xl text-muted-foreground">Chaotic tea, riddles and a curious guest list — a party like no other.</p>
          <p className="text-lg text-muted-foreground">Complete Chapter 2's mini-game to unlock</p>
          <div className="mt-6">
            <button
              onClick={() => goTo?.(2)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90"
            >
              Play Chapter 2 to Unlock
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="chapter3"
      className="min-h-screen flex items-center justify-center py-20 with-wallpaper"
      style={{ ["--wallpaper-url" as any]: `url(${wallpaper})` }}
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
          <div className="inline-block bg-black/50 px-6 py-2 rounded-full mb-4">
            <span className="text-white font-bold text-sm tracking-wider">CHAPTER 3</span>
          </div>
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-white mb-8">
            The Mad Tea Party
          </h2>

          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center gap-4">
            <button
              onClick={() => setClickMode(false)}
              className={`px-4 py-2 rounded-full transition-all ${!clickMode
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
            >
              📜 Scroll Mode
            </button>
            <button
              onClick={() => setClickMode(true)}
              className={`px-4 py-2 rounded-full transition-all ${clickMode
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
            >
              📖 Story Mode
            </button>
          </div>

          <div className="flex justify-center gap-8 mb-8">
            <CharacterImage
              src={madHatterImg}
              alt="Mad Hatter"
              isSpeaking={currentSpeaker === "Mad Hatter"}
              className="max-w-[200px] animate-float"
            />
            <CharacterImage
              src={marchHareImg}
              alt="March Hare"
              isSpeaking={currentSpeaker === "March Hare"}
              className="max-w-[200px] animate-float"
            />
          </div>

          <div className="bg-purple-900/70 text-white backdrop-blur-md rounded-2xl p-6 text-center text-lg italic animate-fade-in mb-8">
            Alice joins the Mad Hatter, March Hare, and Dormouse at a chaotic tea party.
          </div>

          <div className="flex justify-center mt-4">
            <img src={teaPartyImg} alt="Mad Tea Party" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
          </div>
        </div>

        {clickMode ? (
          /* CLICK MODE: Single content area with fade transitions */
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            {/* Scene 0: Mad Hatter - No room */}
            {currentScene === 0 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Mad Hatter"
                  text="No room! No room!"
                  delay={0}
                  characterImage={madHatterImg}
                  onSpeakingChange={(speaking) => {
                    setCurrentSpeaker(speaking ? "Mad Hatter" : null);
                    handleSpeakingChange(speaking);
                  }}
                  audioFile={c3_no_room}
                />
                <div className="text-center mt-4 text-white/60 text-sm">
                  {isAudioPlaying ? (
                    <span className="animate-pulse">🔊 Playing audio...</span>
                  ) : (
                    <span className="animate-pulse">👆 Click to continue</span>
                  )}
                </div>
              </div>
            )}

            {/* Scene 1: Mad Hatter No Room image */}
            {currentScene === 1 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={madHatterNoRoomImg} alt="Mad Hatter - No room" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
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
                  text="But there's plenty of space!"
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => {
                    setCurrentSpeaker(speaking ? "Alice" : null);
                    handleSpeakingChange(speaking);
                  }}
                  audioFile={c3_plenty_of_space}
                />
                <div className="text-center mt-4 text-white/60 text-sm">
                  {isAudioPlaying ? (
                    <span className="animate-pulse">🔊 Playing audio...</span>
                  ) : (
                    <span className="animate-pulse">👆 Click to continue</span>
                  )}
                </div>
              </div>
            )}

            {/* Scene 3: March Hare speaks */}
            {currentScene === 3 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="March Hare"
                  text="Have some tea — or don't. It's always tea time anyway!"
                  delay={0}
                  characterImage={marchHareImg}
                  onSpeakingChange={(speaking) => {
                    setCurrentSpeaker(speaking ? "March Hare" : null);
                    handleSpeakingChange(speaking);
                  }}
                  audioFile={c3_have_some_tea}
                />
                <div className="text-center mt-4 text-white/60 text-sm">
                  {isAudioPlaying ? (
                    <span className="animate-pulse">🔊 Playing audio...</span>
                  ) : (
                    <span className="animate-pulse">👆 Click to continue</span>
                  )}
                </div>
              </div>
            )}

            {/* Scene 4: Alice questions */}
            {currentScene === 4 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Alice"
                  text="Always? When do you have lunch?"
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => {
                    setCurrentSpeaker(speaking ? "Alice" : null);
                    handleSpeakingChange(speaking);
                  }}
                  audioFile={c3_lunch}
                />
                <div className="text-center mt-4 text-white/60 text-sm">
                  {isAudioPlaying ? (
                    <span className="animate-pulse">🔊 Playing audio...</span>
                  ) : (
                    <span className="animate-pulse">👆 Click to continue</span>
                  )}
                </div>
              </div>
            )}

            {/* Scene 5: Tea cup shuffle */}
            {currentScene === 5 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="bg-card rounded-3xl p-8 shadow-xl">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      shuffleCups();
                    }}
                    className="mx-auto block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    Shuffle the Tea Cups!
                  </button>
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}

            {/* Scene 6: Mad Hatter about Time */}
            {currentScene === 6 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <DialogueBox
                  speaker="Mad Hatter"
                  text="When Time behaves himself, which he never does."
                  delay={0}
                  characterImage={madHatterImg}
                  onSpeakingChange={(speaking) => {
                    setCurrentSpeaker(speaking ? "Mad Hatter" : null);
                    handleSpeakingChange(speaking);
                  }}
                  audioFile={c3_time_behaves}
                />
                <div className="text-center mt-4 text-white/60 text-sm">
                  {isAudioPlaying ? (
                    <span className="animate-pulse">🔊 Playing audio...</span>
                  ) : (
                    <span className="animate-pulse">👆 Click to continue</span>
                  )}
                </div>
              </div>
            )}

            {/* Scene 7: Dormouse sleeps */}
            {currentScene === 7 && (
              <div className="animate-fade-in w-full" onClick={nextScene}>
                <div className="text-center my-6">
                  <div className="inline-flex items-center gap-3 bg-purple-900/70 text-white/90 backdrop-blur-sm rounded-2xl px-6 py-4">
                    <span className="text-5xl">😴</span>
                    <span className="italic text-white/90">(Dormouse falls asleep mid-sentence.)</span>
                  </div>
                </div>
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}

            {/* Scene 8: Dormouse asleep image */}
            {currentScene === 8 && (
              <div className="animate-fade-in w-full flex flex-col items-center" onClick={nextScene}>
                <img src={dormouseAsleepImg} alt="Dormouse asleep" className="max-w-xs w-full md:w-auto rounded-2xl shadow-2xl" />
                <div className="text-center mt-4 text-white/60 text-sm animate-pulse">
                  👆 Click to continue
                </div>
              </div>
            )}

            {/* Scene 9: Alice leaves & mini-game */}
            {currentScene === 9 && (
              <div className="animate-fade-in w-full flex flex-col items-center space-y-6" onClick={nextScene}>
                <DialogueBox
                  speaker="Alice"
                  text="I think I'll have my tea elsewhere…"
                  delay={0}
                  characterImage={aliceImg}
                  onSpeakingChange={(speaking) => {
                    setCurrentSpeaker(speaking ? "Alice" : null);
                    handleSpeakingChange(speaking);
                  }}
                  audioFile={c3_tea_elsewhere}
                />
                <div className="text-center mt-4 text-white/60 text-sm">
                  {isAudioPlaying ? (
                    <span className="animate-pulse">🔊 Playing audio...</span>
                  ) : (
                    <span className="animate-pulse">👆 Click to continue</span>
                  )}
                </div>
                {!gameComplete ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGame(true);
                    }}
                    className="bg-primary text-primary-foreground px-12 py-5 rounded-full text-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl animate-pulse"
                  >
                    🍵 Escape the Endless Tea Party
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-2xl text-green-400 font-bold animate-bounce">✅ Chapter 3 Complete!</p>
                    <button
                      onClick={() => goTo?.(4)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all shadow-xl"
                    >
                      Continue to Chapter 4 →
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
              speaker="Mad Hatter"
              text="No room! No room!"
              delay={0}
              characterImage={madHatterImg}
              onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Mad Hatter")}
              audioFile={c3_no_room}
            />
            <div className="flex justify-center mt-4">
              <img src={madHatterNoRoomImg} alt="Mad Hatter - No room" className="max-w-md w-full md:w-auto rounded-2xl shadow-2xl" />
            </div>
            <DialogueBox
              speaker="Alice"
              text="But there's plenty of space!"
              delay={2500}
              characterImage={aliceImg}
              onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
              audioFile={c3_plenty_of_space}
            />
            <DialogueBox
              speaker="March Hare"
              text="Have some tea — or don't. It's always tea time anyway!"
              delay={5000}
              characterImage={marchHareImg}
              onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("March Hare")}
              audioFile={c3_have_some_tea}
            />
            <DialogueBox
              speaker="Alice"
              text="Always? When do you have lunch?"
              delay={9500}
              characterImage={aliceImg}
              onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
              audioFile={c3_lunch}
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
              audioFile={c3_time_behaves}
            />

            <div className="text-center my-6">
              <div className="inline-flex items-center gap-3 bg-purple-900/70 text-white/90 backdrop-blur-sm rounded-2xl px-6 py-4">
                <span className="text-5xl">😴</span>
                <span className="italic text-white/90">(Dormouse falls asleep mid-sentence.)</span>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <img src={dormouseAsleepImg} alt="Dormouse asleep" className="max-w-xs w-full md:w-auto rounded-2xl shadow-2xl" />
            </div>

            <DialogueBox
              speaker="Alice"
              text="I think I'll have my tea elsewhere…"
              delay={14000}
              characterImage={aliceImg}
              onSpeakingChange={(speaking) => speaking && setCurrentSpeaker("Alice")}
              audioFile={c3_tea_elsewhere}
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
              <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 text-white text-center animate-fade-in">
                <p className="text-xl font-semibold">✨ Chapter Complete! Scroll down to continue...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
