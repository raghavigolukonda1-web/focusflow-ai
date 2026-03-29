import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const titleY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 12 } }), [0, 1], [80, 0]);
  const titleOp = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(spring({ frame: frame - 50, fps, config: { damping: 15 } }), [0, 1], [40, 0]);

  const glowPulse = 0.4 + Math.sin(frame * 0.08) * 0.2;
  const ringRotate = interpolate(frame, [0, 300], [0, 360]);

  // Burst lines
  const burstOp = interpolate(frame, [10, 30, 90, 120], [0, 0.6, 0.6, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Glowing ring */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "3px solid rgba(59, 130, 246, 0.4)",
          transform: `scale(${ringScale}) rotate(${ringRotate}deg)`,
          boxShadow: `0 0 60px rgba(59, 130, 246, ${glowPulse}), inset 0 0 60px rgba(59, 130, 246, ${glowPulse * 0.3})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          border: "2px solid rgba(34, 197, 94, 0.3)",
          transform: `scale(${ringScale}) rotate(${-ringRotate * 0.6}deg)`,
          boxShadow: `0 0 40px rgba(34, 197, 94, ${glowPulse * 0.6})`,
        }}
      />

      {/* Burst lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 3,
            height: 80,
            backgroundColor: i % 2 === 0 ? "#3B82F6" : "#22C55E",
            opacity: burstOp,
            transform: `rotate(${i * 30}deg) translateY(-280px)`,
            borderRadius: 4,
          }}
        />
      ))}

      {/* Robot emoji */}
      <Sequence from={5} durationInFrames={295}>
        <div
          style={{
            position: "absolute",
            fontSize: 80,
            transform: `scale(${spring({ frame: frame - 5, fps, config: { damping: 8 } })})`,
            top: "28%",
          }}
        >
          🤖
        </div>
      </Sequence>

      {/* Title */}
      <div
        style={{
          fontFamily: outfit,
          fontSize: 90,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleOp,
          textShadow: "0 0 40px rgba(59, 130, 246, 0.5), 0 4px 20px rgba(0,0,0,0.5)",
          lineHeight: 1.1,
        }}
      >
        AI Productivity
        <br />
        <span
          style={{
            background: "linear-gradient(90deg, #3B82F6, #22C55E, #F59E0B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Assistant
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: "22%",
          fontFamily: "Inter, sans-serif",
          fontSize: 32,
          color: "rgba(255,255,255,0.7)",
          opacity: subtitleOp,
          transform: `translateY(${subtitleY}px)`,
          textAlign: "center",
          letterSpacing: 2,
        }}
      >
        Your Smart Companion for Peak Performance
      </div>
    </AbsoluteFill>
  );
};
