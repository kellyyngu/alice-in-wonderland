import { useState, useEffect } from "react";
import { ChapterNav } from "@/components/ChapterNav";
import { Hero } from "@/components/chapters/Hero";
import { Chapter1 } from "@/components/chapters/Chapter1";
import { Chapter2 } from "@/components/chapters/Chapter2";
import { Chapter3 } from "@/components/chapters/Chapter3";
import { Chapter4 } from "@/components/chapters/Chapter4";
import { Chapter5 } from "@/components/chapters/Chapter5";
import { Awakening } from "@/components/chapters/Awakening";
import { WonderlandGallery } from "@/components/chapters/WonderlandGallery";

const Index = () => {
  const STORAGE_KEY = "aiw-unlocked";
  const STORAGE_ACTIVE = "aiw-active";

  const [unlockedChapters, setUnlockedChapters] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      chapter1: true,
      chapter2: false,
      chapter3: false,
      chapter4: false,
      chapter5: false,
    };
  });

  // activeIndex: 0 = hero, 1 = chapter1, 2 = chapter2, ..., 5 = chapter5, 6 = awakening, 7 = gallery
  const [activeIndex, setActiveIndex] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE);
      if (raw) return Number(raw);
    } catch (e) {}
    return 0;
  });

  const unlockChapter = (chapterKey: keyof typeof unlockedChapters) => {
    setUnlockedChapters(prev => ({
      ...prev,
      [chapterKey]: true,
    }));
  };

  const goToNext = () => setActiveIndex((i) => Math.min(7, i + 1));

  const markUnlockAndNext = (chapterKey: keyof typeof unlockedChapters) => {
    setUnlockedChapters(prev => ({ ...prev, [chapterKey]: true }));
    // advance to next index
    goToNext();
  };

  // persist unlocked state and activeIndex
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedChapters));
      localStorage.setItem(STORAGE_ACTIVE, String(activeIndex));
    } catch (e) {
      // ignore
    }
  }, [unlockedChapters, activeIndex]);

  return (
    <div className="relative">
  <ChapterNav activeIndex={activeIndex} setActiveIndex={setActiveIndex} unlockedChapters={unlockedChapters} />

  {/* Render a single active section */}
  {activeIndex === 0 && <Hero onBegin={() => setActiveIndex(1)} />}
      {activeIndex === 1 && (
        <Chapter1 isUnlocked={unlockedChapters.chapter1} onComplete={() => markUnlockAndNext('chapter2')} goTo={setActiveIndex} />
      )}
      {activeIndex === 2 && (
        <Chapter2 isUnlocked={unlockedChapters.chapter2} onComplete={() => markUnlockAndNext('chapter3')} goTo={setActiveIndex} />
      )}
      {activeIndex === 3 && (
        <Chapter3 isUnlocked={unlockedChapters.chapter3} onComplete={() => markUnlockAndNext('chapter4')} goTo={setActiveIndex} />
      )}
      {activeIndex === 4 && (
        <Chapter4 isUnlocked={unlockedChapters.chapter4} onComplete={() => markUnlockAndNext('chapter5')} goTo={setActiveIndex} />
      )}
      {activeIndex === 5 && (
        <Chapter5 isUnlocked={unlockedChapters.chapter5} onComplete={() => markUnlockAndNext('chapter5')} goTo={setActiveIndex} />
      )}

      {/* Awakening page (shown after Chapter 5 completes, before gallery) */}
      {activeIndex === 6 && (
        <Awakening goTo={setActiveIndex} />
      )}

      {/* Show the Wonderland gallery only when all five chapters are unlocked and active (index 7) */}
      {activeIndex === 7 && unlockedChapters.chapter1 && unlockedChapters.chapter2 && unlockedChapters.chapter3 && unlockedChapters.chapter4 && unlockedChapters.chapter5 && (
        <WonderlandGallery />
      )}
    </div>
  );
};

export default Index;
