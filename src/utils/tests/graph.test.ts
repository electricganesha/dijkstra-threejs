import { describe, expect, beforeEach, test, vitest } from "vitest";

import { Graph } from "../graph";
import { Matrix4, Mesh, Vector3 } from "three";

describe("Graph", () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph();
  });

  test("should add nodes correctly", () => {
    const value = new Vector3(1, 2, 3);
    graph.addNode(0, value);

    expect(graph.nodes.size).toBe(1);
    expect(graph.nodes.get(0)?.value).toEqual(value);
  });

  test("should add edges correctly", () => {
    const value1 = new Vector3(1, 2, 3);
    const value2 = new Vector3(4, 5, 6);

    graph.addNode(0, value1);
    graph.addNode(1, value2);
    graph.addEdge(0, 1, 10);

    const node1 = graph.nodes.get(0);
    const node2 = graph.nodes.get(1);

    expect(node1?.edges.length).toBe(1);
    expect(node2?.edges.length).toBe(1);
    expect(node1?.edges[0].weight).toBe(10);
    expect(node1?.edges[0].node2).toBe(node2);
  });

  test("should throw error when adding edge to non-existent nodes", () => {
    expect(() => graph.addEdge(0, 1, 10)).toThrow("Node not found");
  });

  test("should clear the graph correctly", () => {
    const value = new Vector3(1, 2, 3);
    graph.addNode(0, value);
    graph.clear();

    expect(graph.nodes.size).toBe(0);
    expect(graph.adjacencyList.size).toBe(0);
  });

  test("should compute graph correctly from a mesh", () => {
    // Mock Mesh and Geometry
    const mockMesh = {
      geometry: {
        getAttribute: vitest.fn().mockReturnValue({
          count: 3,
          getX: vitest.fn((index) => [0, 1, 2][index]),
          getY: vitest.fn((index) => [0, 1, 2][index]),
          getZ: vitest.fn((index) => [0, 1, 2][index]),
        }),
        getIndex: vitest.fn().mockReturnValue({
          count: 3,
          getX: vitest.fn((index) => [0, 1, 2][index]),
        }),
      },
      matrixWorld: new Matrix4(),
    };

    graph.target = mockMesh as unknown as Mesh;
    graph.computeGraph();

    expect(graph.nodes.size).toBe(3);
    expect(graph.adjacencyList.size).toBe(3);
  });
});
