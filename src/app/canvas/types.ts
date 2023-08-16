import { Vector4 } from "@babylonjs/core/Maths/math.vector";


export interface PlanetItemType {
  id: number,
  pos: [number, number, number],
  color: number[]
}

export interface SphereOptions {
    segments?: number;
    diameter?: number;
    diameterX?: number;
    diameterY?: number;
    diameterZ?: number;
    arc?: number;
    slice?: number;
    sideOrientation?: number;
    frontUVs?: Vector4;
    backUVs?: Vector4;
    updatable?: boolean;
}