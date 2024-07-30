import { MeshBasicMaterial } from "three";
import { Clouds, Cloud } from "@react-three/drei";
import { useAppState } from "../store/AppState";

export const CloudComponent = () => {
  const clouds = useAppState((s) => s.enableClouds);

  if (!clouds) return null;

  return (
    <Clouds material={MeshBasicMaterial} position={[0, 17, 0]}>
      <Cloud
        seed={2}
        segments={40}
        bounds={[20, 1, 20]}
        volume={20}
        color="slategrey"
        concentrate="inside"
        speed={0.1}
      />
      <Cloud
        seed={1}
        segments={40}
        bounds={[20, 1, 20]}
        volume={20}
        color="F5FFFA"
        fade={100}
        concentrate="inside"
        speed={0.1}
      />
    </Clouds>
  );
};
