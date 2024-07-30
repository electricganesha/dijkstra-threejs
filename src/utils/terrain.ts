import {
  BufferGeometry,
  BufferAttribute,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  Color,
  BackSide,
} from "three";
import { createNoise2D } from "simplex-noise";

export const createMountainousTerrain = (enableWireframe: boolean) => {
  const bG = new BufferGeometry();

  const width = 20;
  const height = 20;
  const widthSegments = 40;
  const heightSegments = 40;

  const numVertices = (widthSegments + 1) * (heightSegments + 1);
  const numIndices = widthSegments * heightSegments * 6;

  const positions = new Float32Array(numVertices * 3);
  const indices = new Uint16Array(numIndices);
  const colors = new Float32Array(numVertices * 3);

  const noise2D = createNoise2D();

  function getElevation(x: number, z: number) {
    const scale = 0.1;
    const amplitude = 4;

    let elevation = noise2D(x * scale, z * scale) * amplitude;

    const octaves = 4;
    let frequency = scale;
    let amplitudeSum = amplitude;
    for (let i = 1; i < octaves; i++) {
      frequency *= 2;
      amplitudeSum /= 2;
      elevation += noise2D(x * frequency, z * frequency) * amplitudeSum;
    }

    return elevation;
  }

  function getColorByElevation(elevation: number) {
    const color = new Color(0xffffff);
    if (elevation < 0.5) {
      color.setRGB(0.278, 0.345, 0.255);
    } else if (elevation < 1.0) {
      color.setRGB(0.624, 0.722, 0.678);
    } else if (elevation < 1.5) {
      color.setRGB(0.33, 0.42, 0.18);
    } else if (elevation < 2.0) {
      color.setRGB(0.55, 0.27, 0.07);
    } else if (elevation < 2.5) {
      color.setRGB(0.24, 0.25, 0.24);
    } else {
      color.setRGB(1.0, 1.0, 1.0);
    }

    return color;
  }

  let vertexIndex = 0;
  for (let i = 0; i <= widthSegments; i++) {
    for (let j = 0; j <= heightSegments; j++) {
      const x = (i / widthSegments) * width - width / 2;
      const z = (j / heightSegments) * height - height / 2;
      const y = getElevation(x, z);

      positions[vertexIndex * 3] = x;
      positions[vertexIndex * 3 + 1] = y;
      positions[vertexIndex * 3 + 2] = z;

      const color = getColorByElevation(y);
      colors[vertexIndex * 3] = color.r;
      colors[vertexIndex * 3 + 1] = color.g;
      colors[vertexIndex * 3 + 2] = color.b;

      vertexIndex++;
    }
  }

  // Populate the indices
  let index = 0;
  for (let i = 0; i < widthSegments; i++) {
    for (let j = 0; j < heightSegments; j++) {
      const a = i * (heightSegments + 1) + j;
      const b = a + heightSegments + 1;
      const c = a + 1;
      const d = b + 1;

      // Define faces in counter-clockwise order
      indices[index++] = a;
      indices[index++] = b;
      indices[index++] = c;

      indices[index++] = c;
      indices[index++] = b;
      indices[index++] = d;
    }
  }

  const positionAttribute = new BufferAttribute(positions, 3);
  const indexAttribute = new BufferAttribute(indices, 1);
  const colorAttribute = new BufferAttribute(colors, 3);

  bG.setAttribute("position", positionAttribute);
  bG.setIndex(indexAttribute);
  bG.setAttribute("color", colorAttribute);

  // Calculate normals
  const normals = new Float32Array(numVertices * 3);
  const normalCounts = new Uint16Array(numVertices);
  const faceNormals = new Float32Array(numVertices * 3);

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];

    const vA = new Vector3().fromArray(positions, a * 3);
    const vB = new Vector3().fromArray(positions, b * 3);
    const vC = new Vector3().fromArray(positions, c * 3);

    const faceNormal = new Vector3()
      .subVectors(vB, vA)
      .cross(new Vector3().subVectors(vC, vA))
      .normalize();

    faceNormals[a * 3] += faceNormal.x;
    faceNormals[a * 3 + 1] += faceNormal.y;
    faceNormals[a * 3 + 2] += faceNormal.z;

    faceNormals[b * 3] += faceNormal.x;
    faceNormals[b * 3 + 1] += faceNormal.y;
    faceNormals[b * 3 + 2] += faceNormal.z;

    faceNormals[c * 3] += faceNormal.x;
    faceNormals[c * 3 + 1] += faceNormal.y;
    faceNormals[c * 3 + 2] += faceNormal.z;

    normalCounts[a]++;
    normalCounts[b]++;
    normalCounts[c]++;
  }

  for (let i = 0; i < normals.length; i += 3) {
    const count = normalCounts[i / 3];
    if (count > 0) {
      normals[i] = faceNormals[i] / count;
      normals[i + 1] = faceNormals[i + 1] / count;
      normals[i + 2] = faceNormals[i + 2] / count;
    }
  }

  bG.setAttribute("normal", new Float32BufferAttribute(normals, 3));

  bG.computeVertexNormals();

  const material = new MeshStandardMaterial({
    vertexColors: true,
    side: BackSide,
    roughness: 0.9,
    metalness: 0.1,
    wireframe: enableWireframe,
  });

  const bMesh = new Mesh(bG, material);

  return bMesh;
};
