import { Box, useCursor } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { getShortestPath } from "../utils/dijkstra";
import { Graph, Node } from "../utils/graph";

interface InteractiveBoxProps {
  node: Node;
  graph: Graph;
  isDragging: boolean;
  setSelectedPoints: Dispatch<SetStateAction<Node[]>>;
  setShortestPath: Dispatch<SetStateAction<Node[]>>;
}

export const InteractiveBox = ({
  node,
  graph,
  isDragging,
  setSelectedPoints,
  setShortestPath,
}: InteractiveBoxProps) => {
  const [hovered, setHovered] = useState<boolean>(false);
  useCursor(hovered);

  const onClick = useCallback(
    (event: ThreeEvent<PointerEvent | MouseEvent>, node: Node) => {
      if (!graph || isDragging) return;
      event.stopPropagation();

      setSelectedPoints((prevPoints) => {
        const updatedPoints = [...prevPoints, node];

        if (updatedPoints.length > 2) {
          updatedPoints.shift();
          updatedPoints.shift();
          setShortestPath([]);
        }

        if (updatedPoints.length === 2) {
          const [start, end] = updatedPoints;

          if (start !== undefined && end !== undefined) {
            const shortestPath = getShortestPath(
              end.index,
              start.index,
              graph.nodes
            );

            shortestPath && setShortestPath(shortestPath);
          }
        }

        return updatedPoints;
      });
    },
    [graph, isDragging, setSelectedPoints, setShortestPath]
  );

  const onEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <Box
      args={[0.1, 0.1, 0.1]}
      position={node.value}
      onPointerDown={(event) => onClick(event, node)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <meshLambertMaterial
        color="#dfd3c3"
        polygonOffset
        polygonOffsetFactor={-50}
        transparent
        opacity={0.8}
      />
    </Box>
  );
};
