import { Sphere } from "@react-three/drei";
import { Node } from "../utils/graph";

interface MarkerSphereProps {
  selectedPoint: Node;
  index: number;
}

export const MarkerSphere = ({ selectedPoint, index }: MarkerSphereProps) => {
  return (
    <Sphere args={[0.15, 16, 16]} position={selectedPoint.value} key={index}>
      <meshLambertMaterial
        color="#f76b8a"
        polygonOffset
        polygonOffsetFactor={-50}
      />
    </Sphere>
  );
};
