import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });

const problems = [
  { emoji: "😩", text: "Missing Deadlines?" },
  { emoji: "📉", text: "No Productivity Tracking?" },
  { emoji: "⏰", text: "Wasting Time?" },
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headY = interpolate(spring({ frame, fps, config: { damping: 15 } }), [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          fontFamily: outfit,
          fontSize: 64,
          fontWeight: 700,
          color: "#EF4444",
          opacity: headOp,
          transform: `translateY(${headY}px)`,
          textShadow: "0 0 30px rgba(239, 68, 68, 0.4)",
        }}
      >
        Sound Familiar?
      </div>

      {/* Problem cards */}
      <div style={{ display: "flex", gap: 60, marginTop: 40 }}>
        {problems.map((p, i) => {
          const delay = 30 + i * 25;
          const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 150 } });
          const scale = interpolate(s, [0, 1], [0.3, 1]);
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
          const shake = frame > delay + 20 ? Math.sin((frame - delay) * 0.15) * 3 : 0;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                opacity: op,
                transform: `scale(${scale}) translateX(${shake}px)`,
              }}
            >
              <div style={{ fontSize: 80 }}>{p.emoji}</div>
              <div
                style={{
                  fontFamily: outfit,
                  fontSize: 30,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  maxWidth: 280,
                }}
              >
                {p.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <Sequence from={120}>
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            fontFamily: "Inter, sans-serif",
            fontSize: 36,
            color: "#3B82F6",
            opacity: interpolate(frame - 120, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(spring({ frame: frame - 120, fps, config: { damping: 20 } }), [0, 1], [30, 0])}px)`,
            textShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          There's a smarter way... ✨
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
