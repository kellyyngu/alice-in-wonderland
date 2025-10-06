import { useState } from "react";
import { ChapterNav } from "@/components/ChapterNav";
import { Hero } from "@/components/chapters/Hero";
import { Chapter1 } from "@/components/chapters/Chapter1";
import { Chapter2 } from "@/components/chapters/Chapter2";
import { Chapter3 } from "@/components/chapters/Chapter3";
import { Chapter4 } from "@/components/chapters/Chapter4";
import { Chapter5 } from "@/components/chapters/Chapter5";
import { WonderlandGallery } from "@/components/chapters/WonderlandGallery";

const Index = () => {
  const [unlockedChapters, setUnlockedChapters] = useState({
    chapter1: true,
    chapter2: false,
    chapter3: false,
    chapter4: false,
    chapter5: false,
  });

  const unlockChapter = (chapterKey: keyof typeof unlockedChapters) => {
    setUnlockedChapters(prev => ({
      ...prev,
      [chapterKey]: true,
    }));
  };

  return (
    <div className="relative">
      <ChapterNav />
      <Hero />
      <Chapter1 
        isUnlocked={unlockedChapters.chapter1}
        onComplete={() => unlockChapter('chapter2')}
      />
      <Chapter2 
        isUnlocked={unlockedChapters.chapter2}
        onComplete={() => unlockChapter('chapter3')}
      />
      <Chapter3 
        isUnlocked={unlockedChapters.chapter3}
        onComplete={() => unlockChapter('chapter4')}
      />
      <Chapter4 
        isUnlocked={unlockedChapters.chapter4}
        onComplete={() => unlockChapter('chapter5')}
      />
      <Chapter5 
        isUnlocked={unlockedChapters.chapter5}
        onComplete={() => {}}
      />

      {/* Show the Wonderland gallery only when all five chapters are unlocked */}
      {unlockedChapters.chapter1 && unlockedChapters.chapter2 && unlockedChapters.chapter3 && unlockedChapters.chapter4 && unlockedChapters.chapter5 && (
        <WonderlandGallery />
      )}
    </div>
  );
};

export default Index;
