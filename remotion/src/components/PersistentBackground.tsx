import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const hueShift = interpolate(frame, [0, 1800], [0, 60]);
  const gradientAngle = interpolate(frame, [0, 1800], [135, 225]);

  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(${gradientAngle}deg, 
            hsl(${225 + hueShift * 0.3}, 60%, 6%), 
            hsl(${235 + hueShift * 0.2}, 50%, 10%), 
            hsl(${220 + hueShift * 0.4}, 45%, 8%))`,
        }}
      />
      {/* Glow orbs */}
      {[
        { x: 20, y: 30, color: "59, 130, 246", size: 500, speed: 0.008 },
        { x: 70, y: 60, color: "34, 197, 94", size: 400, speed: 0.012 },
        { x: 50, y: 80, color: "245, 158, 11", size: 350, speed: 0.006 },
      ].map((orb, i) => {
        const ox = orb.x + Math.sin(frame * orb.speed + i * 2) * 10;
        const oy = orb.y + Math.cos(frame * orb.speed + i * 3) * 8;
        const pulse = 0.15 + Math.sin(frame * 0.03 + i) * 0.05;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${ox}%`,
              top: `${oy}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${orb.color}, ${pulse}) 0%, transparent 70%)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
