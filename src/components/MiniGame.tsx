import { useState, useEffect, useRef } from "react";
import { Heart, X } from "lucide-react";

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
  const [showDebug, setShowDebug] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const objectIdRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const keysRef = useRef({ left: false, right: false });
  const playerXRef = useRef(50);
  const velocityRef = useRef(0);

  // Make the mini-game easier: fewer hearts needed and slightly larger collision box
  const TARGET_SCORE = 4;
  const GAME_WIDTH = 100;
  // Collision radius (percent of width). Increase slightly to make catching easier.
  const PLAYER_SIZE = 7;
  const HEART_CHANCE = 0.66; // ~66% hearts, 34% spades

  // Tweakable fall speed and spawn grid
  // Make hearts and spades fall slower and spawn on a finer horizontal grid
  const FALL_SPEED_MIN = 0.25; // percent per frame - minimum fall speed
  const FALL_SPEED_VARIANCE = 0.45; // added random range
  const SPAWN_STEP = 0.5; // horizontal snap step in percent (smaller -> finer placement)

  // Allow runtime tweaks while debugging (kept in state so the debug panel can control them)
  const [dbgTarget, setDbgTarget] = useState(TARGET_SCORE);
  const [dbgSpawnStep, setDbgSpawnStep] = useState(SPAWN_STEP);
  const [dbgFallMin, setDbgFallMin] = useState(FALL_SPEED_MIN);
  const [dbgFallVar, setDbgFallVar] = useState(FALL_SPEED_VARIANCE);

  // Reset the game state for retrying the same chapter (no full reload)
  const resetGame = () => {
    // clear objects, reset refs and state
    setObjects([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    objectIdRef.current = 0;
    playerXRef.current = 50;
    velocityRef.current = 0;
    setPlayerX(50);
  };

  // Persist attempts and best score whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(`aiw-mini-attempts-${chapterNumber}`, String(attempts));
      localStorage.setItem(`aiw-mini-best-${chapterNumber}`, String(bestScore));
    } catch (e) {
      // ignore storage errors
    }
  }, [attempts, bestScore, chapterNumber]);

  useEffect(() => {
    // Spawn objects (slower falling and slightly less frequent)
    const spawnInterval = setInterval(() => {
      if (!gameOver && !gameWon) {
        setObjects((prev) => {
          // compute fine-grained spawn X snapped to SPAWN_STEP
          const rawX = Math.random() * (GAME_WIDTH - 10) + 5;
          const snappedX = Math.round(rawX / dbgSpawnStep) * dbgSpawnStep;
          const speed = dbgFallMin + Math.random() * dbgFallVar;

          return [
            ...prev,
            {
              id: objectIdRef.current++,
              x: snappedX,
              y: 0,
              // use configured slower speeds
              speed,
              type: Math.random() < HEART_CHANCE ? "heart" : "spade",
            },
          ];
        });
      }
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameOver, gameWon]);

  useEffect(() => {
    // Game loop (objects + player physics) using requestAnimationFrame for smoothness
  // Tuned for smaller steps / less jumpy movement when pressing arrow keys
  const ACCEL = 0.12; // percent per frame^2 (smaller acceleration)
  const MAX_SPEED = 1.1; // percent per frame (lower top speed)
  const FRICTION = 0.86; // slightly higher friction so it settles quicker

    const gameLoop = () => {
      if (!gameOver && !gameWon) {
        // Update player physics
        const keys = keysRef.current;
        if (keys.left && !keys.right) {
          velocityRef.current -= ACCEL;
        } else if (keys.right && !keys.left) {
          velocityRef.current += ACCEL;
        } else {
          // apply friction
          velocityRef.current *= FRICTION;
        }

        // clamp velocity
        velocityRef.current = Math.max(
          -MAX_SPEED,
          Math.min(MAX_SPEED, velocityRef.current)
        );

        // update player position
        playerXRef.current = Math.max(
          5,
          Math.min(95, playerXRef.current + velocityRef.current)
        );

        // Update falling objects and check collisions
        setObjects((prev) => {
          const updated = prev
            .map((obj) => ({ ...obj, y: obj.y + obj.speed }))
            .filter((obj) => obj.y < 100);

          // Check collisions against playerXRef for immediacy
          updated.forEach((obj) => {
            if (
              obj.y > 85 &&
              obj.y < 95 &&
              Math.abs(obj.x - playerXRef.current) < PLAYER_SIZE
            ) {
              if (obj.type === "heart") {
                setScore((s) => {
                  const newScore = s + 1;
                  if (newScore >= dbgTarget) {
                    setGameWon(true);
                  }
                  return newScore;
                });
              } else {
                setGameOver(true);
              }
            }
          });

          return updated;
        });

        // push visual state from refs to React state (keeps UI in sync)
        setPlayerX(playerXRef.current);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameOver, gameWon, playerX]);

  // When gameOver set, increment attempts and update bestScore
  useEffect(() => {
    if (gameOver) {
      setAttempts((a) => a + 1);
      setBestScore((b) => Math.max(b, score));
    }
  }, [gameOver]);

  // When gameWon set, record attempt and bestScore
  useEffect(() => {
    if (gameWon) {
      setAttempts((a) => a + 1);
      setBestScore((b) => Math.max(b, score));
    }
  }, [gameWon]);

  useEffect(() => {
    // Only use arrow keys for controls. Track keydown and keyup for smooth continuous movement.
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

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">
            Escape the {chapterNumber === 1 ? "Rabbit Hole" : chapterNumber === 2 ? "Drink Me Curse" : chapterNumber === 3 ? "Mad Tea Party" : chapterNumber === 4 ? "Cheshire's Riddle" : "Queen's Wrath"}!
          </h2>
          <p className="text-white/80 text-xl mb-2">
            Collect {TARGET_SCORE} ❤️ hearts to proceed • Avoid ♠️ spades!
          </p>
          <div className="text-3xl font-bold text-accent">
            Score: {score} / {TARGET_SCORE}
          </div>
          <div className="mt-2 text-sm text-white/70">
            Attempts: {attempts} • Best: {bestScore}
          </div>
        </div>

        <div
          ref={gameAreaRef}
          className="relative bg-black/40 backdrop-blur-sm rounded-3xl border-4 border-white/20 overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Falling objects */}
          {objects.map((obj) => (
            <div
              key={obj.id}
              className="absolute text-4xl"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: "translate(-50%, -50%)",
                willChange: "transform, top",
              }}
            >
              {obj.type === "heart" ? "❤️" : "♠️"}
            </div>
          ))}

          {/* Player */}
          <div
            className="absolute bottom-8 w-16 h-16"
            style={{
              left: `${playerX}%`,
              transform: "translateX(-50%)",
              willChange: "transform, left",
            }}
          >
            <div className="w-full h-full bg-accent rounded-full shadow-lg shadow-accent/50 flex items-center justify-center text-2xl animate-pulse">
              ✨
            </div>
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-6 animate-fade-in">
              <X className="w-24 h-24 text-destructive" />
              <h3 className="font-serif text-4xl font-bold text-white">Lost in Wonderland!</h3>
              <p className="text-white/80 text-lg">You hit a spade...</p>
              <div className="flex gap-4">
                <button
                  onClick={() => resetGame()}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Try Again
                </button>
                <button
                  onClick={onFailure}
                  className="bg-muted text-foreground px-8 py-4 rounded-full font-bold hover:bg-muted/80 transition-all hover:scale-105"
                >
                  Exit Game
                </button>
              </div>
            </div>
          )}

          {/* Victory Overlay */}
          {gameWon && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-6 animate-fade-in">
              <Heart className="w-24 h-24 text-accent animate-pulse" />
              <h3 className="font-serif text-4xl font-bold text-white">Chapter Unlocked!</h3>
              <p className="text-white/80 text-lg">You collected {TARGET_SCORE} hearts!</p>
              <button
                onClick={onSuccess}
                className="bg-accent text-accent-foreground px-12 py-4 rounded-full font-bold hover:bg-accent/90 transition-all hover:scale-105 text-xl"
              >
                Continue Adventure →
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-center text-white/60">
            Use arrow keys to move ✨
          </p>

          <button
            onClick={() => setShowDebug((s) => !s)}
            className="ml-4 bg-white/10 text-white px-3 py-1 rounded-full text-sm"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
        </div>

        {showDebug && (
          <div className="max-w-2xl mx-auto mt-4 bg-white/5 p-4 rounded-lg text-white text-sm">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                Target:
                <input type="number" value={dbgTarget} min={1} onChange={(e) => setDbgTarget(Number(e.target.value))} className="w-20 text-black ml-2 p-1 rounded" />
              </label>
              <label className="flex items-center gap-2">
                Spawn step:
                <input type="number" step="0.1" value={dbgSpawnStep} onChange={(e) => setDbgSpawnStep(Number(e.target.value))} className="w-20 text-black ml-2 p-1 rounded" />
              </label>
              <label className="flex items-center gap-2">
                Fall min:
                <input type="number" step="0.05" value={dbgFallMin} onChange={(e) => setDbgFallMin(Number(e.target.value))} className="w-20 text-black ml-2 p-1 rounded" />
              </label>
              <label className="flex items-center gap-2">
                Fall var:
                <input type="number" step="0.05" value={dbgFallVar} onChange={(e) => setDbgFallVar(Number(e.target.value))} className="w-20 text-black ml-2 p-1 rounded" />
              </label>
              <button onClick={() => { setDbgTarget(TARGET_SCORE); setDbgSpawnStep(SPAWN_STEP); setDbgFallMin(FALL_SPEED_MIN); setDbgFallVar(FALL_SPEED_VARIANCE); }} className="ml-auto bg-white/10 px-3 py-1 rounded">Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
