import React from "react";

interface AwakeningProps {
  goTo?: (index: number) => void;
}

export const Awakening = ({ goTo }: AwakeningProps) => {
  return (
    <section
      className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(6,6,12,0.45), rgba(6,6,12,0.15)), url(/src/assets/wallpaper.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 z-10">
        <div className="text-center animate-fade-in">
          <div className="bg-black/65 backdrop-blur-md rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto border border-white/10">
            <div className="text-7xl mb-6">☀️</div>
            <h3 className="font-serif text-5xl font-bold text-white mb-6">A Curious Dream</h3>
            <p className="text-2xl text-muted-foreground italic leading-relaxed mb-8">
              And with that, Alice awoke, as if from a very curious dream...
            </p>
            <div className="text-6xl mb-8 animate-float">👧</div>

            <button
              onClick={() => goTo?.(7)}
              className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
            >
              Enter Wonderland Gallery ✨
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awakening;
