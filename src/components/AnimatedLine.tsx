import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { Line2 } from "three/examples/jsm/Addons.js";

const AnimatedLine = ({ points }: { points: Vector3[] }) => {
  const lineRef = useRef<Line2>(null);
  const [visiblePoints, setVisiblePoints] = useState<Vector3[]>([]);
  const [animationStarted, setAnimationStarted] = useState<boolean>(false);
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Duration of animation in seconds
  const animationDuration = 1;

  useFrame(({ clock }) => {
    if (!animationStarted) {
      setAnimationStarted(true);
      setStartTime(clock.getElapsedTime());
      return;
    }

    if (animationCompleted) {
      return; // Stop updating if animation is completed
    }

    if (startTime === null) return;

    const elapsedTime = clock.getElapsedTime() - startTime;
    const progress = Math.min(
      points.length,
      Math.floor((elapsedTime / animationDuration) * points.length)
    );
    setVisiblePoints(points.slice(0, progress));

    if (progress >= points.length) {
      // Ensure we stop at the last point
      setAnimationCompleted(true);
    }
  });

  if (visiblePoints.length === 0) return null;

  return (
    <Line
      ref={lineRef}
      points={visiblePoints}
      color="#f76b8a"
      lineWidth={5}
      polygonOffset
      polygonOffsetFactor={-50}
    />
  );
};

export default AnimatedLine;
