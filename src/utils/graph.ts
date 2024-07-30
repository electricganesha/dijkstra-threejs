import { Mesh, Vector3 } from "three";

// Node class represents individual vertices on the mesh
export class Node {
  index: number;
  value: Vector3;
  edges: Edge[];

  constructor(index: number, value: Vector3, edges: Edge[] = []) {
    this.index = index;
    this.value = value;
    this.edges = edges;
  }
}

// Edge class represents edges between nodes
export class Edge {
  node1: Node;
  node2: Node;
  weight: number;

  constructor(node1: Node, node2: Node, weight: number) {
    this.node1 = node1;
    this.node2 = node2;
    this.weight = weight;
  }
}

// Graph class manages the graph structure
export class Graph {
  adjacencyList: Map<number, number[]>;
  nodes: Map<number, Node>;
  target: Mesh | undefined;

  constructor() {
    this.adjacencyList = new Map();
    this.nodes = new Map();
  }

  clear() {
    this.nodes.clear();
    this.adjacencyList.clear();
  }

  addNode(index: number, value: Vector3) {
    if (!this.nodes.has(index)) {
      this.nodes.set(index, new Node(index, value));
      this.adjacencyList.set(index, []);
    }
  }

  addEdge(index1: number, index2: number, weight = 1) {
    const node1 = this.nodes.get(index1);
    const node2 = this.nodes.get(index2);

    if (!node1 || !node2) {
      throw new Error("Node not found");
    }

    const edge = new Edge(node1, node2, weight);
    node1.edges.push(edge);
    node2.edges.push(edge);

    if (!this.adjacencyList.has(index1)) {
      this.adjacencyList.set(index1, []);
    }
    if (!this.adjacencyList.has(index2)) {
      this.adjacencyList.set(index2, []);
    }

    this.adjacencyList.get(index1)!.push(index2);
    this.adjacencyList.get(index2)!.push(index1);
  }

  computeGraph() {
    if (!this.target) return;

    const positions = this.target.geometry.getAttribute("position");
    const indices = this.target.geometry.getIndex();

    if (!indices) {
      throw new Error(
        "Mesh geometry is not indexed. Can only compute indexed geometries."
      );
    }

    const vertex = new Vector3();
    const addedEdges = new Set<string>();

    // Add nodes
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      if (this.target) vertex.applyMatrix4(this.target.matrixWorld);
      this.addNode(i, vertex.clone());
    }

    // Add edges
    for (let i = 0; i < indices.count; i += 3) {
      const indexA = indices.getX(i);
      const indexB = indices.getX(i + 1);
      const indexC = indices.getX(i + 2);

      const edgeAB = [Math.min(indexA, indexB), Math.max(indexA, indexB)].join(
        "-"
      );
      const edgeBC = [Math.min(indexB, indexC), Math.max(indexB, indexC)].join(
        "-"
      );
      const edgeCA = [Math.min(indexC, indexA), Math.max(indexC, indexA)].join(
        "-"
      );

      if (!addedEdges.has(edgeAB)) {
        const weightAB = this.nodes
          .get(indexA)!
          .value.distanceTo(this.nodes.get(indexB)!.value);
        this.addEdge(indexA, indexB, weightAB);
        addedEdges.add(edgeAB);
      }

      if (!addedEdges.has(edgeBC)) {
        const weightBC = this.nodes
          .get(indexB)!
          .value.distanceTo(this.nodes.get(indexC)!.value);
        this.addEdge(indexB, indexC, weightBC);
        addedEdges.add(edgeBC);
      }

      if (!addedEdges.has(edgeCA)) {
        const weightCA = this.nodes
          .get(indexC)!
          .value.distanceTo(this.nodes.get(indexA)!.value);
        this.addEdge(indexC, indexA, weightCA);
        addedEdges.add(edgeCA);
      }
    }
  }
}
