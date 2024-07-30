import { Mesh, MeshStandardMaterial } from "three";
import { Graph, Node } from "../utils/graph";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { PointerEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createMountainousTerrain } from "../utils/terrain";
import AnimatedLine from "./AnimatedLine";
import { CloudComponent } from "./CloudComponent";
import { InteractiveBox } from "./InteractiveBox";
import { MarkerSphere } from "./MarkerSphere";
import { useAppState } from "../store/AppState";

const CLICK_THRESHOLD = 5;

export const Scene = () => {
  const [terrain, setTerrain] = useState<Mesh | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<Node[]>([]);
  const [shortestPath, setShortestPath] = useState<Node[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownPosition, setMouseDownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const enableWireframe = useAppState((s) => s.enableWireframe);

  useEffect(() => {
    if (!terrain) return;

    (terrain.material as MeshStandardMaterial).wireframe = enableWireframe;
  }, [enableWireframe, terrain]);

  const mountainousTerrain = useMemo(
    () => createMountainousTerrain(enableWireframe),
    []
  );

  useEffect(() => {
    if (!terrain) return;

    const graph = new Graph();
    graph.target = terrain;
    graph.computeGraph();
    setGraph(graph);
  }, [terrain]);

  useEffect(() => {
    if (terrain) return;

    setTerrain(mountainousTerrain);
  }, [graph, terrain]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      setMouseDownPosition({ x: event.clientX, y: event.clientY });
      setIsDragging(false);
    },
    []
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (mouseDownPosition) {
        const dx = event.clientX - mouseDownPosition.x;
        const dy = event.clientY - mouseDownPosition.y;
        if (Math.sqrt(dx * dx + dy * dy) > CLICK_THRESHOLD) {
          setIsDragging(true);
        }
      }
    },
    [mouseDownPosition]
  );

  const handlePointerUp = useCallback(() => {
    setMouseDownPosition(null);
  }, []);

  if (!terrain) return null;

  return (
    <Canvas
      camera={{ position: [0, 20, 20] }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      shadows
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 8, 0]} castShadow intensity={100} />
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 3}
        enableZoom={true}
        minDistance={5}
        maxDistance={25}
      />
      <group>
        <primitive object={terrain} castShadow receiveShadow />
      </group>
      <group>
        {selectedPoints.map((selectedPoint, index) => (
          <MarkerSphere
            key={index}
            selectedPoint={selectedPoint}
            index={index}
          />
        ))}
      </group>
      <group visible={true}>
        {graph &&
          Array.from(graph.nodes.values()).map((node) => (
            <group key={node.index}>
              <InteractiveBox
                node={node}
                graph={graph}
                isDragging={isDragging}
                setSelectedPoints={setSelectedPoints}
                setShortestPath={setShortestPath}
              />
            </group>
          ))}
        <group>
          {shortestPath.length > 0 && (
            <AnimatedLine
              points={[...shortestPath.map((sp) => sp.value).reverse()]}
            />
          )}
        </group>
      </group>
      <Sky
        sunPosition={[0, 8, 0]}
        inclination={0}
        azimuth={0.5}
        turbidity={0.8}
        rayleigh={0}
        mieCoefficient={0.1}
        mieDirectionalG={0.8}
      />
      <CloudComponent />
    </Canvas>
  );
};
