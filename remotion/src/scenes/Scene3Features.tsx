import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

const features = [
  { icon: "📋", title: "Smart Tasks", desc: "Add, track & complete", color: "#3B82F6" },
  { icon: "⏱️", title: "Time Tracking", desc: "Per-task timer", color: "#22C55E" },
  { icon: "📊", title: "Dashboard", desc: "Charts & analytics", color: "#F59E0B" },
  { icon: "🧠", title: "AI Insights", desc: "Personalized coaching", color: "#A855F7" },
];

export const Scene3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headScale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          fontFamily: outfit,
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          opacity: headOp,
          transform: `scale(${headScale})`,
          textShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
        }}
      >
        Packed with Power ⚡
      </div>

      {/* Feature cards */}
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600, marginTop: 60 }}>
        {features.map((f, i) => {
          const delay = 40 + i * 35;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
          const y = interpolate(s, [0, 1], [100, 0]);
          const op = interpolate(s, [0, 1], [0, 1]);
          const glow = 0.2 + Math.sin(frame * 0.05 + i) * 0.1;

          return (
            <div
              key={i}
              style={{
                width: 340,
                padding: "40px 30px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${f.color}33`,
                opacity: op,
                transform: `translateY(${y}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                boxShadow: `0 0 40px ${f.color}${Math.round(glow * 255).toString(16).padStart(2, "0")}, inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
            >
              <div style={{ fontSize: 56 }}>{f.icon}</div>
              <div style={{ fontFamily: outfit, fontSize: 28, fontWeight: 700, color: f.color }}>{f.title}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: "rgba(255,255,255,0.6)" }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
