import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

const suggestions = [
  "⏰ You're most productive at 9 AM. Schedule deep work then!",
  "🔥 Great 81% score! Keep up this momentum.",
  "🎯 Try the 2-minute rule for quick tasks.",
  "📈 Your Thursday output was 30% higher — replicate that routine!",
];

export const Scene5AI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headScale = spring({ frame, fps, config: { damping: 10 } });
  const headOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const brainPulse = 1 + Math.sin(frame * 0.1) * 0.05;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: headOp,
          transform: `scale(${headScale})`,
        }}
      >
        <div style={{ fontSize: 70, transform: `scale(${brainPulse})` }}>🧠</div>
        <div
          style={{
            fontFamily: outfit,
            fontSize: 68,
            fontWeight: 800,
            background: "linear-gradient(90deg, #A855F7, #3B82F6, #22C55E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI-Powered Insights
        </div>
      </div>

      {/* Suggestion cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200, marginTop: 80 }}>
        {suggestions.map((s, i) => {
          const delay = 40 + i * 30;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const x = interpolate(sp, [0, 1], [i % 2 === 0 ? -300 : 300, 0]);
          const op = interpolate(sp, [0, 1], [0, 1]);
          const glow = 0.1 + Math.sin(frame * 0.04 + i) * 0.05;

          return (
            <div
              key={i}
              style={{
                padding: "24px 36px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                borderLeft: "4px solid #A855F7",
                opacity: op,
                transform: `translateX(${x}px)`,
                fontFamily: "Inter, sans-serif",
                fontSize: 26,
                color: "rgba(255,255,255,0.85)",
                boxShadow: `0 0 30px rgba(168, 85, 247, ${glow})`,
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
