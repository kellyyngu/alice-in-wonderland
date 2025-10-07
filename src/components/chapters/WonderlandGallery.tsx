import { Book, Users, Coffee, Smile, Crown } from "lucide-react";
import aliceWonderlandImg from "@/assets/alice-wonderland.png";

const chapters = [
  {
    id: "chapter1",
    title: "Down the Rabbit Hole",
    icon: "🕳️",
    color: "from-purple-900 to-purple-700",
  },
  {
    id: "chapter2",
    title: "Drink Me, Eat Me",
    icon: "🧃",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "chapter3",
    title: "The Mad Tea Party",
    icon: "🍵",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "chapter4",
    title: "The Cheshire Cat",
    icon: "😸",
    color: "from-pink-500 to-purple-500",
  },
  {
    id: "chapter5",
    title: "The Queen's Court",
    icon: "❤️",
    color: "from-red-500 to-pink-500",
  },
];

export const WonderlandGallery = () => {
  const scrollToChapter = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="wonderland-gallery"
      className="min-h-screen py-20 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(6,6,12,0.65), rgba(6,6,12,0.35)), url(/src/assets/wallpaper.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {["🌟", "✨", "🎭", "🎩", "🌹", "🫖", "🃏", "🔑"][i % 8]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 z-10 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-9xl mb-6 animate-float">🎪</div>
          <h1 className="font-serif text-7xl md:text-8xl font-bold text-white mb-6">
            Wonderland Gallery
          </h1>
          <p className="text-2xl text-white/80 mb-8">
            Your journey through the looking glass is complete!
          </p>
          
          <div className="max-w-md mx-auto mb-12">
            <img
              src={aliceWonderlandImg}
              alt="Alice in Wonderland"
              className="rounded-3xl shadow-2xl animate-scale-in"
            />
          </div>
        </div>

        {/* Chapter Gallery */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-bold text-white text-center mb-8">
            Revisit Your Adventures
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => scrollToChapter(chapter.id)}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-6xl mb-4">{chapter.icon}</div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">
                  {chapter.title}
                </h3>
                <div className={`h-1 w-full bg-gradient-to-r ${chapter.color} rounded-full mt-4`} />
              </button>
            ))}
          </div>
        </div>

        {/* Character Bios */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-16">
          <h2 className="font-serif text-4xl font-bold text-white text-center mb-8">
            Meet the Characters
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-5xl mb-3">🐇</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">White Rabbit</h3>
              <p className="text-white/70">
                Always in a hurry, this anxious rabbit led Alice into Wonderland with his pocket watch and endless worry about being late.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-5xl mb-3">🎩</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Mad Hatter</h3>
              <p className="text-white/70">
                Host of the never-ending tea party, where time stands still and riddles have no answers.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-5xl mb-3">😸</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Cheshire Cat</h3>
              <p className="text-white/70">
                The mysterious feline whose grin remains even after he disappears, offering cryptic wisdom.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-5xl mb-3">👑</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Queen of Hearts</h3>
              <p className="text-white/70">
                The tyrannical ruler of Wonderland, quick to demand "Off with their heads!" at the slightest offense.
              </p>
            </div>
          </div>
        </div>

        {/* Secret Ending Choice */}
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-8">
            Choose Your Wonderland Ending
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => scrollToChapter("chapter3")}
              className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 hover:scale-105 transition-all shadow-2xl group"
            >
              <Coffee className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Stay for Tea
              </h3>
              <p className="text-white/90 text-sm">
                Join the Mad Hatter's eternal tea party
              </p>
            </button>

            <button
              onClick={() => scrollToChapter("chapter4")}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 hover:scale-105 transition-all shadow-2xl group"
            >
              <Smile className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Follow the Cat
              </h3>
              <p className="text-white/90 text-sm">
                Wander with the Cheshire Cat
              </p>
            </button>

            <button
              onClick={() => scrollToChapter("hero")}
              className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 hover:scale-105 transition-all shadow-2xl group"
            >
              <Book className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Start Again
              </h3>
              <p className="text-white/90 text-sm">
                Return to the rabbit hole
              </p>
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-16 text-center text-white/60">
          <p className="text-lg mb-2">✨ Thank you for journeying through Wonderland ✨</p>
          <p className="text-sm">Created with curiosity and wonder</p>
        </div>
      </div>
    </section>
  );
};
