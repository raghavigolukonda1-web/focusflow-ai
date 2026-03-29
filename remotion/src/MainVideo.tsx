import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { PersistentBackground } from "./components/PersistentBackground";
import { Sparkles } from "./components/Sparkles";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Features } from "./scenes/Scene3Features";
import { Scene4Dashboard } from "./scenes/Scene4Dashboard";
import { Scene5AI } from "./scenes/Scene5AI";
import { Scene6Timer } from "./scenes/Scene6Timer";
import { Scene7Closing } from "./scenes/Scene7Closing";

const T = 30; // transition frames

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <Sparkles count={40} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene1Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={210}>
          <Scene2Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene3Features />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={270}>
          <Scene4Dashboard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene5AI />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={210}>
          <Scene6Timer />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene7Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
