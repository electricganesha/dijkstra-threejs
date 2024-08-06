import { describe, it, expect } from "vitest";
import { createMountainousTerrain } from "../terrain";
import {
  Mesh,
  BufferGeometry,
  BufferAttribute,
  Float32BufferAttribute,
} from "three";

describe("createMountainousTerrain", () => {
  it("should create a Mesh object", () => {
    const mesh = createMountainousTerrain(false);
    expect(mesh).toBeInstanceOf(Mesh);
  });

  it("should create a BufferGeometry object", () => {
    const mesh = createMountainousTerrain(false);
    expect(mesh.geometry).toBeInstanceOf(BufferGeometry);
  });

  it("should have position attribute in geometry", () => {
    const mesh = createMountainousTerrain(false);
    const positionAttribute = mesh.geometry.getAttribute("position");
    expect(positionAttribute).toBeInstanceOf(BufferAttribute);
    expect(positionAttribute.array.length).toBeGreaterThan(0);
  });

  it("should have color attribute in geometry", () => {
    const mesh = createMountainousTerrain(false);
    const colorAttribute = mesh.geometry.getAttribute("color");
    expect(colorAttribute).toBeInstanceOf(BufferAttribute);
    expect(colorAttribute.array.length).toBeGreaterThan(0);
  });

  it("should have normal attribute in geometry", () => {
    const mesh = createMountainousTerrain(false);
    const normalAttribute = mesh.geometry.getAttribute("normal");
    expect(normalAttribute).toBeInstanceOf(Float32BufferAttribute);
    expect(normalAttribute.array.length).toBeGreaterThan(0);
  });

  it("should set wireframe property of material based on input", () => {
    const meshWithWireframe = createMountainousTerrain(true);
    expect(meshWithWireframe.material.wireframe).toBe(true);

    const meshWithoutWireframe = createMountainousTerrain(false);
    expect(meshWithoutWireframe.material.wireframe).toBe(false);
  });
});
