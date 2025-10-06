import { useEffect, useState } from "react";

interface FallingObjectProps {
  icon: string;
  delay?: number;
  duration?: number;
}

export const FallingObject = ({ icon, delay = 0, duration = 8 }: FallingObjectProps) => {
  const [position] = useState({
    left: Math.random() * 100,
    rotation: Math.random() * 360,
  });

  return (
    <div
      className="absolute text-4xl opacity-70 animate-fall"
      style={{
        left: `${position.left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {icon}
    </div>
  );
};
