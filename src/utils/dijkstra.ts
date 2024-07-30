import { Node } from "./graph";

/**
 * Calculates the shortest path between two nodes using Dijkstra's algorithm (https://en.wikipedia.org/wiki/Dijkstra's_algorithm).
 * @param startIndex - The index of the start node.
 * @param endIndex - The index of the end node.
 * @param nodes - A map of nodes where the key is the node index and the value is the node itself.
 * @returns An array of node values representing the shortest path, or null if no path is found.
 */
export const getShortestPath = (
  startIndex: number,
  endIndex: number,
  nodes: Map<number, Node>
): Node[] | null => {
  const startNode = nodes.get(startIndex);
  const endNode = nodes.get(endIndex);

  if (!startNode || !endNode) {
    console.error("Start or end node is undefined");
    return null;
  }

  const distances = new Map<Node, number>();
  const previousNodes = new Map<Node, Node>();
  const queue = new PriorityQueue();

  distances.set(startNode, 0);
  queue.enqueue(startNode, 0);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode === endNode) {
      const path: Node[] = [];
      let node: Node | undefined = currentNode;

      while (node) {
        path.unshift(node);
        node = previousNodes.get(node);
      }

      return path;
    }

    currentNode.edges.forEach(({ node1, node2, weight }) => {
      const adjacentNode = node1 === currentNode ? node2 : node1;
      const currentDistance = distances.get(currentNode);

      if (currentDistance === undefined) return;

      const newDistance = currentDistance + weight;
      const adjacentNodeDistance = distances.get(adjacentNode);

      if (
        adjacentNodeDistance === undefined ||
        newDistance < adjacentNodeDistance
      ) {
        distances.set(adjacentNode, newDistance);
        previousNodes.set(adjacentNode, currentNode);
        queue.enqueue(adjacentNode, newDistance);
      }
    });
  }

  console.error("Failed to find path");
  return null;
};

/**
 * A priority queue implemented as a binary heap. (https://www.techiedelight.com/introduction-priority-queues-using-binary-heaps/)
 */
class PriorityQueue {
  elements: { node: Node; priority: number }[] = [];

  /**
   * Adds a node to the queue with a given priority.
   * @param node - The node to add.
   * @param priority - The priority of the node.
   */
  enqueue(node: Node, priority: number) {
    this.elements.push({ node, priority });
    this.bubbleUp(this.elements.length - 1);
  }

  /**
   * Removes and returns the node with the highest priority.
   * @returns The node with the highest priority.
   */
  dequeue(): Node {
    const first = this.elements[0];
    const last = this.elements.pop()!;
    if (this.elements.length > 0) {
      this.elements[0] = last;
      this.bubbleDown(0);
    }

    return first.node;
  }

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * Moves a node up in the tree, i.e., towards the root.
   * @param index - The index of the node to move up.
   */
  bubbleUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.elements[parentIndex].priority <= this.elements[index].priority)
        break;
      [this.elements[parentIndex], this.elements[index]] = [
        this.elements[index],
        this.elements[parentIndex],
      ];
      index = parentIndex;
    }
  }

  /**
   * Moves a node down in the tree, i.e., away from the root.
   * @param index - The index of the node to move down.
   */
  bubbleDown(index: number) {
    const length = this.elements.length;
    const element = this.elements[index];

    let swapIndex: number | null;

    do {
      swapIndex = null;
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;

      if (leftChildIndex < length) {
        if (this.elements[leftChildIndex].priority < element.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        if (
          (swapIndex === null &&
            this.elements[rightChildIndex].priority < element.priority) ||
          (swapIndex !== null &&
            this.elements[rightChildIndex].priority <
              this.elements[leftChildIndex].priority)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex !== null) {
        this.elements[index] = this.elements[swapIndex];
        this.elements[swapIndex] = element;
        index = swapIndex;
      }
    } while (swapIndex !== null);
  }
}
