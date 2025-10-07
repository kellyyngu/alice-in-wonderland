interface CharacterImageProps {
  src: string;
  alt: string;
  isSpeaking?: boolean;
  className?: string;
}

export const CharacterImage = ({ src, alt, isSpeaking, className = "" }: CharacterImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`max-w-xs drop-shadow-2xl ${isSpeaking ? "animate-shake" : ""} ${className}`}
    />
  );
};
