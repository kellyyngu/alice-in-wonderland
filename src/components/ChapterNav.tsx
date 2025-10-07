import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const chapters = [
  { id: "hero", title: "Begin Journey", number: "" },
  { id: "chapter1", title: "Down the Rabbit Hole", number: "1" },
  { id: "chapter2", title: "Drink Me, Eat Me", number: "2" },
  { id: "chapter3", title: "The Mad Tea Party", number: "3" },
  { id: "chapter4", title: "The Cheshire Cat", number: "4" },
  { id: "chapter5", title: "The Queen's Court", number: "5" },
  { id: "awakening", title: "A Curious Dream", number: "" },
  { id: "gallery", title: "Wonderland Gallery", number: "" },
];

import { Dispatch, SetStateAction } from "react";

interface Props {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  unlockedChapters: {
    chapter1: boolean;
    chapter2: boolean;
    chapter3: boolean;
    chapter4: boolean;
    chapter5: boolean;
  };
}

export const ChapterNav = ({ activeIndex, setActiveIndex, unlockedChapters }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (index: number) => {
    // allow previewing locked chapters; the chapter component will show locked UI if appropriate
    setActiveIndex(index);
    setIsOpen(false);
  };

  // Determine whether a chapter index is unlocked (for the gallery require all unlocked)
  const isIndexUnlocked = (index: number) => {
    if (index === 0) return true; // hero
    if (index === 1) return true; // chapter1 initially available
    if (index === 2) return unlockedChapters.chapter2;
    if (index === 3) return unlockedChapters.chapter3;
    if (index === 4) return unlockedChapters.chapter4;
    if (index === 5) return unlockedChapters.chapter5;
    // awakening should be available once chapter5 is unlocked; gallery requires all chapters unlocked
    if (index === 6) return unlockedChapters.chapter5;
    if (index === 7) return (
      unlockedChapters.chapter1 && unlockedChapters.chapter2 && unlockedChapters.chapter3 && unlockedChapters.chapter4 && unlockedChapters.chapter5
    );
    return false;
  };

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => {
    const nextIndex = Math.min(chapters.length - 1, activeIndex + 1);
    // allow previewing the next chapter even if locked; gallery remains gated
    if (nextIndex === chapters.length - 1) {
      if (isIndexUnlocked(nextIndex)) setActiveIndex(nextIndex);
    } else {
      setActiveIndex(nextIndex);
    }
  };

  return (
    <nav className="fixed top-6 right-6 z-50 flex items-center gap-2">
      <button
        onClick={prev}
        disabled={activeIndex === 0}
        title="Previous"
        className="bg-card/95 p-2 rounded-full shadow hover:scale-105 disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next preview pill removed per design — keep only Prev/Next buttons and Chapters menu. */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-card/95 backdrop-blur-sm text-foreground px-4 py-2 rounded-full shadow-lg border border-border hover:shadow-xl transition-all flex items-center gap-2 font-medium"
      >
        Chapters
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <button
        onClick={next}
        title="Next"
        className="bg-card/95 p-2 rounded-full shadow hover:scale-105 disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-12 bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-border overflow-hidden min-w-[260px] animate-fade-in">
          {chapters.map((chapter, idx) => {
            const isAwakening = chapter.id === "awakening";

            const isGallery = idx === chapters.length - 1;
            const galleryLocked = isGallery && !isIndexUnlocked(idx);

            // Show Awakening entry greyed-out until chapter5 unlocked
            const awakeningLocked = isAwakening && !unlockedChapters.chapter5;

            const buttonClass = `w-full text-left px-6 py-3 transition-colors flex items-center gap-3 ${galleryLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted'}`;

            const handleClick = () => {
              // Prevent navigating into the gallery until it's unlocked
              if (galleryLocked) return;
              // Prevent navigating to awakening if it's locked
              if (awakeningLocked) return;
              goTo(idx);
            };

            // Wrap gallery in a tooltip when locked
            if (isGallery && galleryLocked) {
              return (
                <Tooltip key={chapter.id}>
                  <TooltipTrigger asChild>
                    <button onClick={handleClick} className={buttonClass}>
                      {chapter.number && (
                        <span className="text-primary font-bold text-lg w-6">{chapter.number}</span>
                      )}
                      <span className="text-sm font-medium flex-1 opacity-60">{chapter.title}</span>
                      <span className="text-muted">🔒</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Unlock all chapters to access the Wonderland Gallery
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={chapter.id}
                onClick={handleClick}
                className={`${buttonClass} ${awakeningLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {chapter.number && (
                  <span className="text-primary font-bold text-lg w-6">{chapter.number}</span>
                )}
                <span className={`text-sm font-medium flex-1 ${awakeningLocked ? 'opacity-60' : ''}`}>{chapter.title}</span>

                {/* For story chapters (1-5): show check if unlocked, otherwise show lock emoji */}
                {idx >= 1 && idx <= 5 ? (
                  isIndexUnlocked(idx) ? (
                    <span className="text-green-400 font-bold">✓</span>
                  ) : (
                    <span className="text-muted">🔒</span>
                  )
                ) : null}

                {/* For Awakening: show lock if it's not yet available */}
                {isAwakening ? (
                  awakeningLocked ? <span className="text-muted">🔒</span> : null
                ) : null}

                {/* For gallery: show lock icon when locked */}
                {isGallery && !galleryLocked ? null : null}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
