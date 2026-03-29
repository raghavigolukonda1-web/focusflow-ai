import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const Scene7Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 100 } });
  const titleOp = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });

  const subOp = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(spring({ frame: frame - 60, fps, config: { damping: 15 } }), [0, 1], [40, 0]);

  const tagOp = interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" });
  const tagScale = spring({ frame: frame - 110, fps, config: { damping: 10 } });

  // Pulsing glow ring
  const glowSize = 600 + Math.sin(frame * 0.04) * 40;
  const glowOp = 0.15 + Math.sin(frame * 0.06) * 0.08;

  // Rotating sparkle ring
  const sparkleRotate = interpolate(frame, [0, 300], [0, 180]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Big glow */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59, 130, 246, ${glowOp}) 0%, rgba(168, 85, 247, ${glowOp * 0.5}) 40%, transparent 70%)`,
        }}
      />

      {/* Sparkle ring */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360 + sparkleRotate;
        const rad = (angle * Math.PI) / 180;
        const r = 320;
        const sx = Math.cos(rad) * r;
        const sy = Math.sin(rad) * r;
        const twinkle = 0.3 + Math.abs(Math.sin(frame * 0.08 + i * 0.5)) * 0.7;
        const colors = ["#3B82F6", "#22C55E", "#F59E0B", "#A855F7"];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${sx}px)`,
              top: `calc(50% + ${sy}px)`,
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: colors[i % 4],
              opacity: twinkle,
              boxShadow: `0 0 12px 4px ${colors[i % 4]}66`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Main title */}
      <div
        style={{
          fontFamily: outfit,
          fontSize: 88,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          opacity: titleOp,
          transform: `scale(${titleScale})`,
          textShadow: "0 0 50px rgba(59, 130, 246, 0.5), 0 0 100px rgba(168, 85, 247, 0.3)",
          lineHeight: 1.2,
        }}
      >
        Work Smarter.
        <br />
        <span
          style={{
            background: "linear-gradient(90deg, #3B82F6, #A855F7, #22C55E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Not Harder.
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          fontFamily: "Inter, sans-serif",
          fontSize: 32,
          color: "rgba(255,255,255,0.6)",
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          textAlign: "center",
        }}
      >
        AI Productivity Assistant — Your Path to Peak Performance
      </div>

      {/* Built with tag */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          padding: "14px 40px",
          borderRadius: 40,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.15))",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          color: "rgba(255,255,255,0.7)",
          opacity: tagOp,
          transform: `scale(${tagScale})`,
          letterSpacing: 1,
        }}
      >
        Built with ❤️ using Lovable
      </div>
    </AbsoluteFill>
  );
};
