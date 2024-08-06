import { getShortestPath } from "../dijkstra";
import { Node, Edge } from "../graph";
import { Vector3 } from "three";
import { describe, expect, beforeEach, test } from "vitest";

// Mock Node class
class MockNode extends Node {
  constructor(index: number, value: Vector3) {
    super(index, value);
  }

  addEdge(node: Node, weight: number) {
    const edge = new Edge(this, node, weight);
    this.edges.push(edge);
    node.edges.push(edge);
  }
}

describe("getShortestPath", () => {
  let nodes: Map<number, Node>;

  beforeEach(() => {
    nodes = new Map<number, Node>();

    const nodeA = new MockNode(0, new Vector3(0, 0, 0));
    const nodeB = new MockNode(1, new Vector3(1, 0, 0));
    const nodeC = new MockNode(2, new Vector3(2, 0, 0));
    const nodeD = new MockNode(3, new Vector3(3, 0, 0));

    nodeA.addEdge(nodeB, 1);
    nodeA.addEdge(nodeC, 4);
    nodeB.addEdge(nodeC, 2);
    nodeB.addEdge(nodeD, 5);
    nodeC.addEdge(nodeD, 1);

    nodes.set(0, nodeA);
    nodes.set(1, nodeB);
    nodes.set(2, nodeC);
    nodes.set(3, nodeD);
  });

  test("should return the shortest path between two nodes", () => {
    const path = getShortestPath(0, 3, nodes);
    expect(path).toEqual([
      nodes.get(0),
      nodes.get(1),
      nodes.get(2),
      nodes.get(3),
    ]);
  });

  test("should return null if start node is undefined", () => {
    const path = getShortestPath(99, 3, nodes);
    expect(path).toBeNull();
  });

  test("should return null if end node is undefined", () => {
    const path = getShortestPath(0, 99, nodes);
    expect(path).toBeNull();
  });

  test("should return null if no path is found", () => {
    const isolatedNode = new MockNode(4, new Vector3(4, 0, 0));
    nodes.set(4, isolatedNode);
    const path = getShortestPath(0, 4, nodes);
    expect(path).toBeNull();
  });
});
