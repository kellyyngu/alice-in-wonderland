import { useState } from "react";
import { ChevronDown } from "lucide-react";

const chapters = [
  { id: "hero", title: "Begin Journey", number: "" },
  { id: "chapter1", title: "Down the Rabbit Hole", number: "1" },
  { id: "chapter2", title: "Drink Me, Eat Me", number: "2" },
  { id: "chapter3", title: "The Mad Tea Party", number: "3" },
  { id: "chapter4", title: "The Cheshire Cat", number: "4" },
  { id: "chapter5", title: "The Queen's Court", number: "5" },
];

export const ChapterNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToChapter = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-card/95 backdrop-blur-sm text-foreground px-6 py-3 rounded-full shadow-lg border border-border hover:shadow-xl transition-all flex items-center gap-2 font-medium"
      >
        Chapters
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-border overflow-hidden min-w-[250px] animate-fade-in">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.id)}
              className="w-full text-left px-6 py-3 hover:bg-muted transition-colors flex items-center gap-3"
            >
              {chapter.number && (
                <span className="text-primary font-bold text-lg w-6">{chapter.number}</span>
              )}
              <span className="text-sm font-medium">{chapter.title}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
