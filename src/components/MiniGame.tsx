import { useState, useEffect, useRef } from "react";
import { Heart, X } from "lucide-react";
import wallpaper from "@/assets/wallpaper.png";
import minigameMusic from "@/assets/minigame_music.mp3";
import heartSound from "@/assets/heart.mp3";

interface MiniGameProps {
  onSuccess: () => void;
  onFailure: () => void;
  chapterNumber: number;
}

interface FallingObject {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: "heart" | "spade";
}

export const MiniGame = ({ onSuccess, onFailure, chapterNumber }: MiniGameProps) => {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(() => {
    try {
      const raw = localStorage.getItem(`aiw-mini-attempts-${chapterNumber}`);
      return raw ? parseInt(raw, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [bestScore, setBestScore] = useState(() => {
    try {
      const raw = localStorage.getItem(`aiw-mini-best-${chapterNumber}`);
      return raw ? parseInt(raw, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [playerX, setPlayerX] = useState(50);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState(0); // ramps up over time
  const [showHint, setShowHint] = useState(true);
  const [preStart, setPreStart] = useState(true);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const objectIdRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const keysRef = useRef({ left: false, right: false });
  const playerXRef = useRef(50);
  const velocityRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gameplay tuning
  const TARGET_SCORE = 4;
  const GAME_WIDTH = 100;
  const PLAYER_SIZE = 7; // collision radius in percent
  const HEART_CHANCE_BASE = 0.66; // base heart probability

  const FALL_SPEED_MIN = 0.25;
  const FALL_SPEED_VARIANCE = 0.45;
  const SPAWN_STEP = 0.5;
  const BASE_SPAWN_INTERVAL = 1000;

  const resetGame = () => {
    setObjects([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    objectIdRef.current = 0;
    playerXRef.current = 50;
    velocityRef.current = 0;
    setPlayerX(50);
    setPreStart(true);
    setShowHint(true);
  };

  // persist attempts/bestScore
  useEffect(() => {
    try {
      localStorage.setItem(`aiw-mini-attempts-${chapterNumber}`, String(attempts));
      localStorage.setItem(`aiw-mini-best-${chapterNumber}`, String(bestScore));
    } catch (e) {
      // ignore
    }
  }, [attempts, bestScore, chapterNumber]);

  // Background music control
  useEffect(() => {
    // Initialize audio on component mount
    if (!audioRef.current) {
      audioRef.current = new Audio(minigameMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4; // Set volume to 40% so it doesn't overpower voice lines
    }

    const audio = audioRef.current;

    // Play music when game starts (not in pre-start mode)
    if (!preStart && !gameOver && !gameWon) {
      audio.play().catch(err => console.error('Error playing minigame music:', err));
    } else {
      // Pause and reset when in pre-start, game over, or won
      audio.pause();
      audio.currentTime = 0;
    }

    // Cleanup: stop music when component unmounts
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [preStart, gameOver, gameWon]);

  // Spawner: respects preStart and increases spade frequency by chapter/difficulty
  useEffect(() => {
    const chapterMultiplier = 1 + Math.max(0, chapterNumber - 1) * 0.2;
    // Extra difficulty boost for early chapters (1-3): faster spawns and faster falls
    const earlyBoost = chapterNumber <= 3 ? 0.35 : 0;
    const earlySpawnPenalty = chapterNumber <= 3 ? 200 : 0; // ms faster spawns for ch 1-3
    const spawnMs = Math.max(250, Math.round(BASE_SPAWN_INTERVAL - (chapterNumber - 1) * 150 - difficulty * 80 - earlySpawnPenalty));

    const id = setInterval(() => {
      if (preStart || gameOver || gameWon) return;

      setObjects((prev) => {
        const rawX = Math.random() * (GAME_WIDTH - 10) + 5;
        const snappedX = Math.round(rawX / SPAWN_STEP) * SPAWN_STEP;
        const speedBase = FALL_SPEED_MIN + Math.random() * FALL_SPEED_VARIANCE;
        // apply difficulty ramp, chapter multiplier and early-chapter boost to speed
        const speed = speedBase * (1 + (difficulty * 0.15) + (chapterMultiplier - 1) + earlyBoost);
        // lower heart chance for earlier chapters to increase spade frequency; clamp to a reasonable minimum
        const heartChance = Math.max(0.15, HEART_CHANCE_BASE - (chapterNumber - 1) * 0.08 - difficulty * 0.03 - (chapterNumber <= 3 ? 0.18 : 0));

        return [
          ...prev,
          {
            id: objectIdRef.current++,
            x: snappedX,
            y: 0,
            speed,
            type: Math.random() < heartChance ? "heart" : "spade",
          },
        ];
      });
    }, spawnMs);

    return () => clearInterval(id);
  }, [chapterNumber, difficulty, gameOver, gameWon, preStart]);

  // Main game loop
  useEffect(() => {
    const ACCEL = 0.12;
    const MAX_SPEED = 1.1;
    const FRICTION = 0.86;

    const loop = () => {
      if (!gameOver && !gameWon) {
        const keys = keysRef.current;
        if (keys.left && !keys.right) velocityRef.current -= ACCEL;
        else if (keys.right && !keys.left) velocityRef.current += ACCEL;
        else velocityRef.current *= FRICTION;

        velocityRef.current = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velocityRef.current));
        playerXRef.current = Math.max(5, Math.min(95, playerXRef.current + velocityRef.current));

        setObjects((prev) => {
          const remaining: FallingObject[] = [];

          prev.forEach((obj) => {
            const newY = obj.y + obj.speed;
            if (newY >= 100) return;

            const isColliding = newY > 85 && newY < 95 && Math.abs(obj.x - playerXRef.current) < PLAYER_SIZE;
            if (isColliding) {
              if (obj.type === "heart") {
                // Play heart sound effect
                const heartAudio = new Audio(heartSound);
                heartAudio.volume = 0.5; // Set volume to 50% so it doesn't overpower background music
                heartAudio.play().catch(err => console.error('Error playing heart sound:', err));

                setScore((s) => {
                  const newScore = s + 1;
                  if (newScore >= TARGET_SCORE) setGameWon(true);
                  return newScore;
                });
              } else {
                setGameOver(true);
              }
            } else {
              remaining.push({ ...obj, y: newY });
            }
          });

          return remaining;
        });

        setPlayerX(playerXRef.current);
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameOver, gameWon]);

  // difficulty ramp
  useEffect(() => {
    const id = setInterval(() => setDifficulty((d) => Math.min(3, d + 1)), 8000);
    return () => clearInterval(id);
  }, [gameOver, gameWon]);

  // hint auto-hide
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, [showHint]);

  // attempts/best updates
  useEffect(() => {
    if (gameOver) {
      setAttempts((a) => a + 1);
      setBestScore((b) => Math.max(b, score));
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameWon) {
      setAttempts((a) => a + 1);
      setBestScore((b) => Math.max(b, score));
    }
  }, [gameWon]);

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;
      if (e.key === "ArrowLeft") {
        keysRef.current.left = true;
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        keysRef.current.right = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        keysRef.current.left = false;
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        keysRef.current.right = false;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, gameWon]);

  // start with Enter/Space
  useEffect(() => {
    if (!preStart) return;
    const onStartKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setPreStart(false);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onStartKey);
    return () => window.removeEventListener("keydown", onStartKey);
  }, [preStart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center with-wallpaper" style={{ ["--wallpaper-url" as any]: `url(${wallpaper})` }}>
      <div className="max-w-2xl w-full mx-auto px-6">
        {showHint && (
          <div className="fixed top-6 right-6 z-50">
            <div
              onClick={() => setShowHint(false)}
              className="bg-black/70 text-white px-4 py-3 rounded-lg cursor-pointer shadow-lg"
              role="button"
              aria-label="Dismiss hint"
            >
              Use ← → arrow keys to move • Catch 4 ❤️ to proceed
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">
            Escape the {chapterNumber === 1 ? "Rabbit Hole" : chapterNumber === 2 ? "Drink Me Curse" : chapterNumber === 3 ? "Mad Tea Party" : chapterNumber === 4 ? "Cheshire's Riddle" : "Queen's Wrath"}!
          </h2>
          <p className="text-white/80 text-xl mb-2">Collect {TARGET_SCORE} ❤️ hearts to proceed • Avoid ♠️ spades!</p>
          <div className="text-3xl font-bold text-accent">Score: {score} / {TARGET_SCORE}</div>
          <div className="mt-2 text-sm text-white/70">Attempts: {attempts} • Best: {bestScore}</div>
        </div>

        <div ref={gameAreaRef} className="relative bg-black/40 backdrop-blur-sm rounded-3xl border-4 border-white/20 overflow-hidden" style={{ height: "500px" }}>
          {/* pre-start overlay */}
          {preStart && !gameOver && !gameWon && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="bg-white/5 p-8 rounded-2xl text-center max-w-lg">
                <h3 className="text-3xl font-serif font-bold text-white mb-4">How to Play</h3>
                <p className="text-white/80 mb-6">Use the ← and → arrow keys to move. Catch {TARGET_SCORE} hearts and avoid spades. Press <span className="font-bold">Start</span> or press Enter to begin.</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => { setPreStart(false); setShowHint(true); }} className="bg-accent text-accent-foreground px-6 py-3 rounded-full font-bold">Start</button>
                  <button onClick={onFailure} className="bg-muted text-foreground px-6 py-3 rounded-full font-bold">Exit</button>
                </div>
              </div>
            </div>
          )}

          {/* Falling objects */}
          {objects.map((obj) => (
            <div key={obj.id} className="absolute text-4xl" style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: "translate(-50%, -50%)", willChange: "transform, top" }}>
              {obj.type === "heart" ? "❤️" : "♠️"}
            </div>
          ))}

          {/* Player */}
          <div className="absolute bottom-8 w-16 h-16" style={{ left: `${playerX}%`, transform: "translateX(-50%)", willChange: "transform, left" }}>
            <div className="w-full h-full bg-accent rounded-full shadow-lg shadow-accent/50 flex items-center justify-center text-2xl animate-pulse">✨</div>
          </div>

          {/* Game Over */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-6 animate-fade-in">
              <X className="w-24 h-24 text-destructive" />
              <h3 className="font-serif text-4xl font-bold text-white">Lost in Wonderland!</h3>
              <p className="text-white/80 text-lg">You hit a spade...</p>
              <div className="flex gap-4">
                <button onClick={() => resetGame()} className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all hover:scale-105">Try Again</button>
                <button onClick={onFailure} className="bg-muted text-foreground px-8 py-4 rounded-full font-bold hover:bg-muted/80 transition-all hover:scale-105">Exit Game</button>
              </div>
            </div>
          )}

          {/* Victory */}
          {gameWon && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-6 animate-fade-in">
              <Heart className="w-24 h-24 text-accent animate-pulse" />
              <h3 className="font-serif text-4xl font-bold text-white">Chapter Unlocked!</h3>
              <p className="text-white/80 text-lg">You collected {TARGET_SCORE} hearts!</p>
              <button onClick={onSuccess} className="bg-accent text-accent-foreground px-12 py-4 rounded-full font-bold hover:bg-accent/90 transition-all hover:scale-105 text-xl">Continue Adventure →</button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-center text-white/60">Use arrow keys to move ✨</p>
        </div>
      </div>
    </div>
  );
};
