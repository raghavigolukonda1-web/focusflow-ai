import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const Scene6Timer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headY = interpolate(spring({ frame, fps, config: { damping: 15 } }), [0, 1], [50, 0]);

  // Animated timer display
  const seconds = Math.floor(interpolate(frame, [30, 180], [0, 47], { extrapolateRight: "clamp" }));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const ringProgress = interpolate(frame, [30, 180], [0, 0.78], { extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 140;
  const dashOffset = circumference * (1 - ringProgress);
  const pulseGlow = 0.3 + Math.sin(frame * 0.1) * 0.15;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: "8%",
          fontFamily: outfit,
          fontSize: 64,
          fontWeight: 800,
          color: "white",
          opacity: headOp,
          transform: `translateY(${headY}px)`,
          textShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
        }}
      >
        ⏱️ Track Every Minute
      </div>

      {/* Timer circle */}
      <div style={{ position: "relative", width: 340, height: 340, marginTop: 40 }}>
        <svg width="340" height="340" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx="170" cy="170" r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="170"
            cy="170"
            r="140"
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 15px rgba(34, 197, 94, ${pulseGlow}))` }}
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: outfit,
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              textShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
            }}
          >
            {timeStr}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            Focus Time
          </div>
        </div>
      </div>

      {/* Task label */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          padding: "16px 40px",
          borderRadius: 12,
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          fontFamily: "Inter, sans-serif",
          fontSize: 24,
          color: "rgba(255,255,255,0.7)",
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        ▶ Working on: "Build Landing Page"
      </div>
    </AbsoluteFill>
  );
};
