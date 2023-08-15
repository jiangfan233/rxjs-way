"use client";

import { useEffect, useRef } from "react";
import {
  CreateSphere,
  Engine,
  FreeCamera,
  HemisphericLight,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { CanvasUtil } from "@lib/canvas";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true, undefined, true);
    const scene = new Scene(engine);
    const canvasUtil = new CanvasUtil(scene, engine);

    
  }, []);

  return (
    <canvas ref={canvasRef} className=' w-full h-full'>
      It seems that your browser does not support WebGL. What a pity :(
    </canvas>
  );
};
