import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface SparklesProps {
  count?: number;
}

export const Sparkles: React.FC<SparklesProps> = ({ count = 30 }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.508;
    const x = ((seed * 7.3) % 100);
    const y = ((seed * 13.7) % 100);
    const size = 2 + (seed % 4);
    const speed = 0.02 + (seed % 10) * 0.005;
    const phase = seed * 0.1;
    const drift = Math.sin(frame * speed + phase) * 15;
    const floatY = Math.cos(frame * speed * 0.7 + phase) * 10;
    const twinkle = 0.2 + Math.abs(Math.sin(frame * 0.05 + phase)) * 0.8;
    const scale = 0.5 + Math.abs(Math.sin(frame * 0.03 + phase * 2)) * 0.5;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x + drift * 0.3}%`,
          top: `${y + floatY * 0.3}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: i % 3 === 0 ? "#3B82F6" : i % 3 === 1 ? "#22C55E" : "#F59E0B",
          opacity: twinkle,
          transform: `scale(${scale})`,
          boxShadow: `0 0 ${size * 3}px ${size}px ${
            i % 3 === 0 ? "rgba(59,130,246,0.4)" : i % 3 === 1 ? "rgba(34,197,94,0.4)" : "rgba(245,158,11,0.4)"
          }`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles}
    </AbsoluteFill>
  );
};
