import { ArrowDown } from "lucide-react";

export const Hero = () => {
  const scrollToChapter1 = () => {
    const element = document.getElementById("chapter1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-sky"
    >
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {["🕰️", "🎩", "🐇", "🌹", "🫖", "🃏"][i]}
          </div>
        ))}
      </div>

      <div className="text-center z-10 px-6">
        <h1 className="font-serif text-7xl md:text-9xl font-bold text-white mb-6 animate-scale-in drop-shadow-2xl">
          Alice in Wonderland
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 mb-12 animate-fade-in font-light" style={{ animationDelay: "200ms" }}>
          A Curious Interactive Journey
        </p>
        <button
          onClick={scrollToChapter1}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all hover:scale-105 shadow-lg border border-white/30 animate-fade-in flex items-center gap-2 mx-auto"
          style={{ animationDelay: "400ms" }}
        >
          Begin the Adventure
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
