import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

const stats = [
  { label: "Tasks", value: 47, color: "#3B82F6" },
  { label: "Completed", value: 38, color: "#22C55E" },
  { label: "Score", value: 81, suffix: "%", color: "#F59E0B" },
  { label: "Peak Hour", value: 9, suffix: ":00", color: "#A855F7" },
];

const barData = [65, 80, 45, 90, 70, 85, 60];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const Scene4Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 100px" }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          fontFamily: outfit,
          fontSize: 64,
          fontWeight: 800,
          color: "white",
          opacity: headOp,
          textShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
        }}
      >
        📊 Live Dashboard
      </div>

      {/* Stat cards row */}
      <div style={{ display: "flex", gap: 30, position: "absolute", top: "20%", left: "8%", right: "8%" }}>
        {stats.map((s, i) => {
          const delay = 15 + i * 15;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const scale = interpolate(sp, [0, 1], [0.5, 1]);
          const op = interpolate(sp, [0, 1], [0, 1]);
          const countUp = Math.min(Math.round(interpolate(frame, [delay, delay + 40], [0, s.value], { extrapolateRight: "clamp" })), s.value);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "28px 20px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${s.color}33`,
                opacity: op,
                transform: `scale(${scale})`,
                textAlign: "center",
                boxShadow: `0 0 25px ${s.color}22`,
              }}
            >
              <div style={{ fontFamily: outfit, fontSize: 48, fontWeight: 800, color: s.color }}>
                {countUp}{s.suffix || ""}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          right: "10%",
          height: 350,
          display: "flex",
          alignItems: "flex-end",
          gap: 40,
          padding: "30px 50px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {barData.map((val, i) => {
          const delay = 80 + i * 12;
          const barH = interpolate(
            spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } }),
            [0, 1],
            [0, (val / 100) * 250]
          );

          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: "100%",
                  height: barH,
                  borderRadius: "12px 12px 4px 4px",
                  background: `linear-gradient(to top, ${i % 2 === 0 ? "#3B82F6" : "#22C55E"}, ${i % 2 === 0 ? "#60A5FA" : "#4ADE80"})`,
                  boxShadow: `0 0 20px ${i % 2 === 0 ? "rgba(59,130,246,0.3)" : "rgba(34,197,94,0.3)"}`,
                }}
              />
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{days[i]}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
